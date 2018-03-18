import HtmlEntity            from '../State/Constants/HtmlEntity';
import MarkupTag             from '../State/Constants/MarkupTag';
import MarkupType            from '../State/Constants/MarkupType';
import IValue                from '../State/Interfaces/IValue';
import RenderMode            from './Constants/RenderMode';
import ICustomBlockInstance  from './Interfaces/ICustomBlockInstance';
import ICustomBlockRenderers from './Interfaces/ICustomBlockRenderers';
import IModule               from './Interfaces/IModule';
import IRendererParams       from './Interfaces/IRendererParams';
import TomeNode              from './TomeNode';
import buildTreeFromValue    from './Util/buildTreeFromValue';
import createAttributesList  from './Util/createAttributesList';

const NON_BREAKING_SPACE = String.fromCharCode(HtmlEntity.NON_BREAKING_SPACE);

class Renderer {
    private customBlocks: ICustomBlockRenderers = {};

    constructor(customBlocks: ICustomBlockRenderers = {}) {
        this.customBlocks = customBlocks;
    }

    public renderValueToHtml(value: IValue): string {
        const root = buildTreeFromValue(value);

        return this.renderTreeToHtml(root);
    }

    public renderTreeToHtml(root: TomeNode): string {
        return this.renderNodesToHtml({mode: RenderMode.CONSUMER}, root.childNodes, root);
    }

    public renderValueToModules(value: IValue): IModule[] {
        const root = buildTreeFromValue(value);

        return this.renderTreeToModules(root);
    }

    public renderTreeToModules(root: TomeNode): IModule[] {
        return root.childNodes.reduce(this.addBlockNodeToModules.bind(this), []);
    }

    public renderNodesToHtml(
        params: IRendererParams,
        nodes: TomeNode[],
        parent: TomeNode
    ): string {
        return nodes.map(node => this.renderNodeToHtml(params, node, parent)).join('');
    }

    public renderNodeToHtml(
        params: IRendererParams,
        node: TomeNode,
        parent: TomeNode
    ): string {
        const isCustomBlock = node.isCustomBlock;
        const isLastChild = node === parent.childNodes[parent.childNodes.length - 1];
        const isText = node.isText;

        let html = '';

        if (isCustomBlock) {
            return this.renderCustomBlockToHtml(params, node);
        } else if (node.isBlock && isLastChild && node.length === 0) {
            // Don't render trailing empty <p> tags

            return html;
        }

        if (!isText) {
            const attributesList = createAttributesList(node.tag);

            html += `<${node.tag + (attributesList.length ? ' ' + attributesList.join(' ') : '')}>`;
        }

        html += this.renderNodeContent(params, node, parent);

        if (isCustomBlock) {
            html += `</${MarkupTag.DIV}>`;
        } else if (!isText && !node.isSelfClosing) {
            html += `</${node.tag}>`;
        }

        return html;
    }

    public renderNodeContent(params, node, parent): string {
        const isEditorMode = params.mode === RenderMode.EDITOR;

        let content: string = '';

        if (node.childNodes.length) {
            content += this.renderNodesToHtml(params, node.childNodes, node);
        } else if (!node.isSelfClosing || node.end === parent.end - 1) {
            // At #text leaf node, or at line break node at end of parent block

            let text = node.text
                // Replace 2 consecutive spaces with visible pattern of alternating
                // space/non-breaking space

                .replace(/ {2}/g, ` ${NON_BREAKING_SPACE}`)

                // Replace leading space or single space with non-breaking space

                .replace(/^ ((?=\S)|$)/g, NON_BREAKING_SPACE);

            if (text === HtmlEntity.BLOCK_BREAK) {
                text = HtmlEntity.LINE_BREAK;
            }

            // If text node is empty, add an anchor break instead

            content += (text.length === 0 && isEditorMode) ? `<${MarkupTag.BR}>` : text;
        }

        if (
            isEditorMode &&
            parent &&
            parent.isBlock &&
            parent.childNodes[parent.childNodes.length - 1] === node &&
            content.match(/ $/)
        ) {
            // If last child of block parent and a trailing space, add an anchor break

            content += `<${MarkupTag.BR}>`;
        }

        return content;
    }

    public renderCustomBlockToHtml(params, node): string {
        switch (params.mode) {
            case RenderMode.EDITOR: {
                const instance: ICustomBlockInstance = {
                    path: node.path,
                    type: node.tag,
                    data: node.data
                };

                params.customBlockInstances.push(instance);

                return `<${MarkupTag.DIV} contenteditable="false"></${MarkupTag.DIV}>`;
            }
            case RenderMode.CONSUMER: {
                const type = node.tag;
                const data = node.data;

                const renderer = this.customBlocks[type];

                if (typeof renderer !== 'function') {
                    throw new TypeError(`[Tome] No custom block renderer provided for type "${type}"`);
                }

                return renderer(type, data);
            }
        }
    }

    private addBlockNodeToModules(modules: IModule[], node: TomeNode, i): IModule[] {
        const parent = node.parent;
        const isLastChild = i === parent.childNodes.length - 1;

        switch (node.type) {
            case MarkupType.CUSTOM_BLOCK:
                modules.push(this.createCustomBlockModule(node));

                break;
            case MarkupType.BLOCK:
                if (node.length > 0 || !isLastChild) {
                    // Don't render trailing empty <p> tags

                    modules.push(this.createBlockModule(node));
                }

                break;
        }

        return modules;
    }

    private createCustomBlockModule(node: TomeNode): IModule {
        return {
            name: node.tag,
            data: node.data
        };
    }

    private createBlockModule(node: TomeNode): IModule {
        const html = this.renderNodeContent({mode: RenderMode.CONSUMER}, node, node.parent);

        const data = {
            content: html
        };

        return {
            name: node.tag,
            data
        };
    }
}

export default Renderer;