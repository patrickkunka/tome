import HtmlEntity           from '../State/Constants/HtmlEntity';
import MarkupTag            from '../State/Constants/MarkupTag';
import MarkupType           from '../State/Constants/MarkupType';
import TomeNode             from './TomeNode';
import createAttributesList from './Util/createAttributesList';

const NON_BREAKING_SPACE = String.fromCharCode(HtmlEntity.NON_BREAKING_SPACE);

class Renderer {
    public static renderNodes(nodes: TomeNode[], parent: TomeNode = null): string {
        return nodes.map(node => Renderer.renderNode(node, parent)).join('');
    }

    public static renderNode(node: TomeNode, parent: TomeNode): string {
        let html: string = '';

        if (node.type === MarkupType.CUSTOM_BLOCK) {
            return `<${MarkupTag.DIV} contenteditable="false"></${MarkupTag.DIV}>`;
        }

        if (node.tag !== MarkupTag.TEXT) {
            const attributesList = createAttributesList(node.tag);

            html += `<${node.tag + (attributesList.length ? ' ' + attributesList.join(' ') : '')}>`;
        }

        if (node.childNodes.length) {
            html += Renderer.renderNodes(node.childNodes, node);
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

            html += text.length ? text : `<${MarkupTag.BR}>`;
        }

        if (parent && parent.isBlock && parent.childNodes[parent.childNodes.length - 1] === node && html.match(/ $/)) {
            // if last child of block parent and a trailing space, add an anchor break

            html += `<${MarkupTag.BR}>`;
        }

        if (node.tag !== MarkupTag.TEXT && !node.isSelfClosing) {
            html += `</${node.tag}>`;
        }

        return html;
    }
}

export default Renderer;