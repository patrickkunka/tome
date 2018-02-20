import HtmlEntity           from '../State/Constants/HtmlEntity';
import MarkupTag            from '../State/Constants/MarkupTag';
import NodeChangeType       from './Constants/NodeChangeType';
import WhitespaceExpression from './Constants/WhitespaceExpression';
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

interface IPatchParams {
    commands: TreePatchCommand[];
    parent: HTMLElement;
}

type IPatchOperation = (
    params: IPatchParams,
    currentNode: Node,
    commandIndex: number,
    currentCommand: TreePatchCommand
) => void;

class TreePatch {
    public static patch(
        params: IPatchParams,
        currentNode: Node,
        commandIndex: number = 0
    ): void {
        const currentCommand = params.commands[commandIndex] || null;

        if (!currentCommand) return;

        return TreePatch.getOperationForType(currentCommand.type)(params, currentNode, commandIndex, currentCommand);
    }

    private static getOperationForType(type: NodeChangeType): IPatchOperation {
        switch (type) {
            case ADD:
                return TreePatch.addNode;
            case REMOVE:
                return TreePatch.removeNode;
            case UPDATE_TEXT:
                return TreePatch.updateText;
            case UPDATE_TAG:
                return TreePatch.updateTag;
            case UPDATE_CHILDREN:
                return TreePatch.updateChildren;
            case UPDATE_NODE:
                return TreePatch.replaceNode;
            default:
                return TreePatch.maintainNode;
        }
    }

    private static addNode(
        params: IPatchParams,
        currentNode: Node,
        commandIndex: number,
        currentCommand: TreePatchCommand
    ): void {
        const addedTomeNode = currentCommand.nextNode;
        const addedTomeNodeHtml = Renderer.renderNode(addedTomeNode, addedTomeNode.parent);
        const addedTomeNodeEl = TreePatch.renderHtmlToDom(addedTomeNodeHtml);

        params.parent.insertBefore(addedTomeNodeEl, currentNode);

        TreePatch.patch(params, currentNode, ++commandIndex);
    }

    private static removeNode(
        params: IPatchParams,
        currentNode: Node,
        commandIndex: number
    ): void {
        const nextSibling = currentNode.nextSibling;

        params.parent.removeChild(currentNode);

        TreePatch.patch(params, nextSibling, ++commandIndex);
    }

    private static updateText(
        params: IPatchParams,
        currentNode: Node,
        commandIndex: number,
        currentCommand: TreePatchCommand
    ): void {
        const nextSibling = currentNode.nextSibling;
        const {textPatchCommand} = currentCommand;

        if (currentNode.nodeName.toLowerCase() === MarkupTag.BR) {
            const textNode = document.createTextNode('');

            params.parent.replaceChild(textNode, currentNode);

            currentNode = textNode;
        }

        const {replaceStart, replaceCount, text} = textPatchCommand;
        const currentNodeAsCharacterData = currentNode as CharacterData;

        currentNodeAsCharacterData.replaceData(replaceStart, replaceCount, text);

        TreePatch.reinforceWhitespace(currentNodeAsCharacterData);

        TreePatch.patch(params, nextSibling, ++commandIndex);
    }

    private static updateTag(
        params: IPatchParams,
        currentNode: Node,
        commandIndex: number,
        currentCommand: TreePatchCommand
    ): void {
        const nextSibling = currentNode.nextSibling;
        const {innerHTML} = currentNode as HTMLElement;
        const updatedTomeNodeEl = TreePatch.renderHtmlToDom(`<${currentCommand.nextTag}/>`) as HTMLElement;

        updatedTomeNodeEl.innerHTML = innerHTML;

        params.parent.replaceChild(updatedTomeNodeEl, currentNode);

        TreePatch.patch(params, nextSibling, ++commandIndex);
    }

    private static updateChildren(
        params: IPatchParams,
        currentNode: Node,
        commandIndex: number,
        currentCommand: TreePatchCommand
    ): void {
        const {firstChild} = currentNode;

        const childParams: IPatchParams = {
            ...params,
            commands: currentCommand.childCommands,
            parent: currentNode as HTMLElement
        };

        TreePatch.patch(childParams, firstChild);
        TreePatch.patch(params, currentNode.nextSibling, ++commandIndex);
    }

    private static replaceNode(
        params: IPatchParams,
        currentNode: Node,
        commandIndex: number,
        currentCommand: TreePatchCommand
    ): void {
        const updatedTomeNode = currentCommand.nextNode;
        const updatedTomeNodeHtml = Renderer.renderNode(updatedTomeNode, updatedTomeNode.parent);
        const updatedTomeNodeEl = TreePatch.renderHtmlToDom(updatedTomeNodeHtml) as HTMLElement;

        params.parent.replaceChild(updatedTomeNodeEl, currentNode);

        TreePatch.patch(params, currentNode.nextSibling, ++commandIndex);
    }

    private static maintainNode(
        params: IPatchParams,
        currentNode: Node,
        commandIndex: number
    ): void {
        TreePatch.patch(params, currentNode.nextSibling, ++commandIndex);
    }

    private static renderHtmlToDom(html: string): Node {
        const temp = document.createElement('div');

        temp.innerHTML = html;

        return temp.firstChild;
    }

    private static reinforceWhitespace(node: CharacterData): void {
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
            node.replaceData(textContent.length, 1, NON_BREAKING_SPACE);
        }
    }
}

export default TreePatch;