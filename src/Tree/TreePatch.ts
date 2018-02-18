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
    ) {
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

    private static addNode(currentCommand, currentNode, currentParent, commands, commandIndex) {
        const addedTomeNode = currentCommand.nextNode;
        const addedTomeNodeHtml = Renderer.renderNode(addedTomeNode, addedTomeNode.parent);
        const addedTomeNodeEl = TreePatch.renderHtmlToDom(addedTomeNodeHtml);

        currentParent.insertBefore(addedTomeNodeEl, currentNode);

        return TreePatch.patch(currentNode, currentParent, commands, ++commandIndex);
    }

    private static removeNode(currentNode, currentParent, commands, commandIndex) {
        const nextSibling = currentNode.nextSibling;

        currentParent.removeChild(currentNode);

        return TreePatch.patch(nextSibling, currentParent, commands, ++commandIndex);
    }

    private static updateText(currentCommand, currentNode, currentParent, commands, commandIndex) {
        const nextSibling = currentNode.nextSibling;

        if (currentNode.nodeName.toLowerCase() === MarkupTag.BR) {
            const textNode = document.createTextNode('');

            currentParent.replaceChild(textNode, currentNode);

            currentNode = textNode;
        }

        // TODO: use CharacterData maniluation methods instead

        currentNode.textContent = currentCommand.nextText;

        return TreePatch.patch(nextSibling, currentParent, commands, ++commandIndex);
    }

    private static updateTag(currentCommand, currentNode, currentParent, commands, commandIndex) {
        const nextSibling = currentNode.nextSibling;
        const {innerHTML} = currentNode as HTMLElement;
        const updatedTomeNodeEl = TreePatch.renderHtmlToDom(`<${currentCommand.nextTag}/>`) as HTMLElement;

        updatedTomeNodeEl.innerHTML = innerHTML;

        currentParent.replaceChild(updatedTomeNodeEl, currentNode);

        return TreePatch.patch(nextSibling, currentParent, commands, ++commandIndex);
    }

    private static updateChildren(currentCommand, currentNode, currentParent, commands, commandIndex) {
        TreePatch.patch(currentNode.childNodes[0], currentNode as HTMLElement, currentCommand.childCommands);

        return TreePatch.patch(currentNode.nextSibling, currentParent, commands, ++commandIndex);
    }

    private static replaceNode(currentCommand, currentNode, currentParent, commands, commandIndex) {
        const updatedTomeNode = currentCommand.nextNode;
        const updatedTomeNodeHtml = Renderer.renderNode(updatedTomeNode, updatedTomeNode.parent);
        const updatedTomeNodeEl = TreePatch.renderHtmlToDom(updatedTomeNodeHtml) as HTMLElement;

        currentParent.replaceChild(updatedTomeNodeEl, currentNode);

        return TreePatch.patch(currentNode.nextSibling, currentParent, commands, ++commandIndex);
    }

    private static maintainNode(currentNode, currentParent, commands, commandIndex) {
        return TreePatch.patch(currentNode.nextSibling, currentParent, commands, ++commandIndex);
    }

    private static renderHtmlToDom(html: string): Node {
        const temp = document.createElement('div');

        temp.innerHTML = html;

        return temp.firstChild;
    }
}

export default TreePatch;