import HtmlEntity           from '../State/Constants/HtmlEntity';
import MarkupTag            from '../State/Constants/MarkupTag';
import NodeChangeType       from './Constants/NodeChangeType';
import WhitespaceExpression from './Constants/WhitespaceExpression';
import ITreePatchOperation  from './Interfaces/ITreePatchOperation';
import ITreePatchParams     from './Interfaces/ITreePatchParams';
import Renderer             from './Renderer';
import TreePatchCommand     from './TreePatchCommand';

const {
    ADD,
    REMOVE,
    UPDATE_TEXT,
    UPDATE_TAG,
    UPDATE_CHILDREN,
    UPDATE_NODE
} = NodeChangeType;

const NON_BREAKING_SPACE = String.fromCharCode(HtmlEntity.NON_BREAKING_SPACE);

class TreePatch {
    private renderer: Renderer = null;

    constructor(renderer) {
        this.renderer = renderer;
    }

    public patch(
        params: ITreePatchParams,
        currentNode: Node,
        commandIndex: number = 0
    ): void {
        const currentCommand = params.commands[commandIndex] || null;

        if (!currentCommand) return;

        return this.getOperationForType(currentCommand.type)
            .call(this, params, currentNode, commandIndex, currentCommand);
    }

    private getOperationForType(type: NodeChangeType): ITreePatchOperation {
        switch (type) {
            case ADD:
                return this.addNode;
            case REMOVE:
                return this.removeNode;
            case UPDATE_TEXT:
                return this.updateText;
            case UPDATE_TAG:
                return this.updateTag;
            case UPDATE_CHILDREN:
                return this.updateChildren;
            case UPDATE_NODE:
                return this.replaceNode;
            default:
                return this.maintainNode;
        }
    }

    private addNode(
        params: ITreePatchParams,
        currentNode: Node,
        commandIndex: number,
        currentCommand: TreePatchCommand
    ): void {
        const addedTomeNode = currentCommand.nextNode;
        const addedTomeNodeHtml = this.renderer.renderNode(addedTomeNode, addedTomeNode.parent);
        const addedTomeNodeEl = this.renderHtmlToDom(addedTomeNodeHtml);
        const {parent} = params;

        parent.insertBefore(addedTomeNodeEl, currentNode);

        if (
            addedTomeNode.text === HtmlEntity.LINE_BREAK &&
            addedTomeNode.parent.lastChild === addedTomeNode &&
            parent.lastChild.nodeName.toLowerCase() !== MarkupTag.BR
        ) {
            // Add safety break after trailing line break to ensure selectable

            parent.innerHTML += `<${MarkupTag.BR}>`;
        }

        this.patch(params, currentNode, ++commandIndex);
    }

    private removeNode(
        params: ITreePatchParams,
        currentNode: Node,
        commandIndex: number,
        currentCommand: TreePatchCommand
    ): void {
        const {prevNode} = currentCommand;
        const {parent} = params;

        let {nextSibling} = currentNode;

        if (prevNode.parent.lastChild === prevNode && nextSibling) {
            // Remove extraneous nextSibling (safety break)

            parent.removeChild(nextSibling);

            nextSibling = null;
        }

        params.parent.removeChild(currentNode);

        this.patch(params, nextSibling, ++commandIndex);
    }

    private updateText(
        params: ITreePatchParams,
        currentNode: Node,
        commandIndex: number,
        currentCommand: TreePatchCommand
    ): void {
        const {nextSibling} = currentNode;
        const {textPatchCommand} = currentCommand;

        if (currentNode.nodeName.toLowerCase() === MarkupTag.BR) {
            const textNode = document.createTextNode('');

            params.parent.replaceChild(textNode, currentNode);

            currentNode = textNode;
        }

        const {replaceStart, replaceCount, replaceWith, fullText} = textPatchCommand;
        const currentNodeAsCharacterData = currentNode as CharacterData;
        const isEmptyingNode = fullText === '';

        if (isEmptyingNode) {
            params.parent.innerHTML = `<${MarkupTag.BR}>`;
        } else {
            currentNodeAsCharacterData.replaceData(replaceStart, replaceCount, replaceWith);
        }

        this.reinforceWhitespace(currentNodeAsCharacterData);

        this.patch(params, nextSibling, ++commandIndex);
    }

    private updateTag(
        params: ITreePatchParams,
        currentNode: Node,
        commandIndex: number,
        currentCommand: TreePatchCommand
    ): void {
        const {nextSibling} = currentNode;
        const {innerHTML} = currentNode as HTMLElement;
        const updatedTomeNodeEl = this.renderHtmlToDom(`<${currentCommand.nextTag}/>`) as HTMLElement;

        updatedTomeNodeEl.innerHTML = innerHTML;

        params.parent.replaceChild(updatedTomeNodeEl, currentNode);

        this.patch(params, nextSibling, ++commandIndex);
    }

    private updateChildren(
        params: ITreePatchParams,
        currentNode: Node,
        commandIndex: number,
        currentCommand: TreePatchCommand
    ): void {
        const {firstChild} = currentNode;

        const childParams: ITreePatchParams = {
            ...params,
            commands: currentCommand.childCommands,
            parent: currentNode as HTMLElement
        };

        this.patch(childParams, firstChild);
        this.patch(params, currentNode.nextSibling, ++commandIndex);
    }

    private replaceNode(
        params: ITreePatchParams,
        currentNode: Node,
        commandIndex: number,
        currentCommand: TreePatchCommand
    ): void {
        const {nextSibling} = currentNode;
        const updatedTomeNode = currentCommand.nextNode;
        const updatedTomeNodeHtml = this.renderer.renderNode(updatedTomeNode, updatedTomeNode.parent);
        const updatedTomeNodeEl = this.renderHtmlToDom(updatedTomeNodeHtml) as HTMLElement;

        params.parent.replaceChild(updatedTomeNodeEl, currentNode);

        this.patch(params, nextSibling, ++commandIndex);
    }

    private maintainNode(
        params: ITreePatchParams,
        currentNode: Node,
        commandIndex: number
    ): void {
        this.patch(params, currentNode.nextSibling, ++commandIndex);
    }

    private renderHtmlToDom(html: string): Node {
        const temp = document.createElement('div');

        temp.innerHTML = html;

        return temp.firstChild;
    }

    private reinforceWhitespace(node: CharacterData): void {
        const {textContent} = node;

        let matches: RegExpExecArray;

        while (matches = WhitespaceExpression.multiple.exec(textContent)) {
            // Replace 2 consecutive spaces with an alternating pattern of
            // reinforced whitespace

            node.replaceData(matches.index, 2, ` ${NON_BREAKING_SPACE}`);
        }

        WhitespaceExpression.multiple.lastIndex = 0;

        if (WhitespaceExpression.leadingOrLone.test(textContent)) {
            node.replaceData(0, 1, NON_BREAKING_SPACE);
        }

        if (WhitespaceExpression.trailing.test(textContent)) {
            node.replaceData(textContent.length - 1, 1, NON_BREAKING_SPACE);
        }
    }
}

export default TreePatch;