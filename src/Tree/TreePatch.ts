import MarkupTag        from '../State/Constants/MarkupTag';
import NodeChangeType   from './Constants/NodeChangeType';
import Renderer         from './Renderer';
import TreePatchCommand from './TreePatchCommand';

const {
    ADD,
    REMOVE,
    UPDATE_TEXT,
    UPDATE_TAG,
    UPDATE_CHILDREN,
    UPDATE_NODE
} = NodeChangeType;

class TreePatch {
    public static patch(
        currentNode: Node,
        currentParent: HTMLElement,
        commands: TreePatchCommand[],
        commandIndex: number = 0
    ): void {
        const currentCommand = commands[commandIndex] || null;

        if (!currentCommand) return;

        switch (currentCommand.type) {
            case ADD:
                return TreePatch.addNode(currentCommand, currentNode, currentParent, commands, commandIndex);
            case REMOVE:
                return TreePatch.removeNode(currentNode, currentParent, commands, commandIndex);
            case UPDATE_TEXT:
                return TreePatch.updateText(currentCommand, currentNode, currentParent, commands, commandIndex);
            case UPDATE_TAG:
                return TreePatch.updateTag(currentCommand, currentNode, currentParent, commands, commandIndex);
            case UPDATE_CHILDREN:
                return TreePatch.updateChildren(currentCommand, currentNode, currentParent, commands, commandIndex);
            case UPDATE_NODE:
                return TreePatch.replaceNode(currentCommand, currentNode, currentParent, commands, commandIndex);
            default:
                return TreePatch.maintainNode(currentNode, currentParent, commands, commandIndex);
        }
    }

    private static addNode(
        currentCommand: TreePatchCommand,
        currentNode: Node,
        currentParent: HTMLElement,
        commands: TreePatchCommand[],
        commandIndex: number
    ): void {
        const addedTomeNode = currentCommand.nextNode;
        const addedTomeNodeHtml = Renderer.renderNode(addedTomeNode, addedTomeNode.parent);
        const addedTomeNodeEl = TreePatch.renderHtmlToDom(addedTomeNodeHtml);

        currentParent.insertBefore(addedTomeNodeEl, currentNode);

        TreePatch.patch(currentNode, currentParent, commands, ++commandIndex);
    }

    private static removeNode(
        currentNode: Node,
        currentParent: HTMLElement,
        commands: TreePatchCommand[],
        commandIndex: number
    ): void {
        const nextSibling = currentNode.nextSibling;

        currentParent.removeChild(currentNode);

        TreePatch.patch(nextSibling, currentParent, commands, ++commandIndex);
    }

    private static updateText(
        currentCommand: TreePatchCommand,
        currentNode: Node,
        currentParent: HTMLElement,
        commands: TreePatchCommand[],
        commandIndex: number
    ): void {
        const nextSibling = currentNode.nextSibling;
        const {textPatchCommand} = currentCommand;

        if (currentNode.nodeName.toLowerCase() === MarkupTag.BR) {
            const textNode = document.createTextNode('');

            currentParent.replaceChild(textNode, currentNode);

            currentNode = textNode;
        }

        const {replaceStart, replaceEnd, text} = textPatchCommand;

        (currentNode as CharacterData).replaceData(replaceStart, replaceEnd - replaceStart, text);

        TreePatch.patch(nextSibling, currentParent, commands, ++commandIndex);
    }

    private static updateTag(
        currentCommand: TreePatchCommand,
        currentNode: Node,
        currentParent: HTMLElement,
        commands: TreePatchCommand[],
        commandIndex: number
    ): void {
        const nextSibling = currentNode.nextSibling;
        const {innerHTML} = currentNode as HTMLElement;
        const updatedTomeNodeEl = TreePatch.renderHtmlToDom(`<${currentCommand.nextTag}/>`) as HTMLElement;

        updatedTomeNodeEl.innerHTML = innerHTML;

        currentParent.replaceChild(updatedTomeNodeEl, currentNode);

        TreePatch.patch(nextSibling, currentParent, commands, ++commandIndex);
    }

    private static updateChildren(
        currentCommand: TreePatchCommand,
        currentNode: Node,
        currentParent: HTMLElement,
        commands: TreePatchCommand[],
        commandIndex: number
    ): void {
        TreePatch.patch(currentNode.childNodes[0], currentNode as HTMLElement, currentCommand.childCommands);

        TreePatch.patch(currentNode.nextSibling, currentParent, commands, ++commandIndex);
    }

    private static replaceNode(
        currentCommand: TreePatchCommand,
        currentNode: Node,
        currentParent: HTMLElement,
        commands: TreePatchCommand[],
        commandIndex: number
    ): void {
        const updatedTomeNode = currentCommand.nextNode;
        const updatedTomeNodeHtml = Renderer.renderNode(updatedTomeNode, updatedTomeNode.parent);
        const updatedTomeNodeEl = TreePatch.renderHtmlToDom(updatedTomeNodeHtml) as HTMLElement;

        currentParent.replaceChild(updatedTomeNodeEl, currentNode);

        TreePatch.patch(currentNode.nextSibling, currentParent, commands, ++commandIndex);
    }

    private static maintainNode(
        currentNode: Node,
        currentParent: HTMLElement,
        commands: TreePatchCommand[],
        commandIndex: number
    ): void {
        TreePatch.patch(currentNode.nextSibling, currentParent, commands, ++commandIndex);
    }

    private static renderHtmlToDom(html: string): Node {
        const temp = document.createElement('div');

        temp.innerHTML = html;

        return temp.firstChild;
    }
}

export default TreePatch;