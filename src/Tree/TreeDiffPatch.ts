import NodeChangeType   from './Constants/NodeChangeType';
import TomeNode         from './TomeNode';
import TreePatchCommand from './TreePatchCommand';

const {
    NONE,
    ADD,
    REMOVE,
    UPDATE_TEXT,
    UPDATE_TAG,
    UPDATE_CHILDREN,
    UPDATE_ALL
} = NodeChangeType;

const getIsEqualNode = (prevNode, nextNode) => TreeDiffPatch.getChangeType(prevNode, nextNode) === NONE;

const getHasChildChanges = (prevNode, nextNode) => (
    prevNode.childNodes.length !== nextNode.childNodes.length ||
    prevNode.childNodes.some((prevChild, i) => !getIsEqualNode(prevChild, nextNode.childNodes[i]))
);

class TreeDiffPatch {
    public static diff(prevNode: TomeNode, nextNode: TomeNode) {
        const command = new TreePatchCommand();

        command.type = TreeDiffPatch.getChangeType(prevNode, nextNode);
        command.childCommands = TreeDiffPatch.diffChildren(prevNode.childNodes, nextNode.childNodes);

        return command;
    }

    public static diffChildren(
        prevChildren:   TomeNode[],
        nextChildren:   TomeNode[],
        commands:       TreePatchCommand[] = [],
        prevPointer:    number             = 0,
        nextPointer:    number             = 0
    ): TreePatchCommand[] {
        const prevChild = prevChildren[prevPointer];
        const nextChild = nextChildren[nextPointer];

        if (!prevChild && !nextChild) return commands;

        const command = new TreePatchCommand();

        commands.push(command);

        if (getIsEqualNode(prevChild, nextChild)) {
            command.type = NONE;

            return TreeDiffPatch.diffChildren(prevChildren, nextChildren, commands, prevPointer + 1, nextPointer + 1);
        } else if (!prevChild || getIsEqualNode(prevChild, nextChildren[nextPointer + 1])) {
            command.type = ADD;

            return TreeDiffPatch.diffChildren(prevChildren, nextChildren, commands, prevPointer, nextPointer + 1);
        } else if (!nextChild || getIsEqualNode(nextChild, prevChildren[prevPointer + 1])) {
            command.type = REMOVE;

            return TreeDiffPatch.diffChildren(prevChildren, nextChildren, commands, prevPointer + 1, nextPointer);
        }

        const updateCommand = TreeDiffPatch.diff(prevChild, nextChild);

        commands[commands.length - 1] = updateCommand;

        return TreeDiffPatch.diffChildren(prevChildren, nextChildren, commands, prevPointer + 1, nextPointer + 1);
    }

    public static getChangeType(prevNode: TomeNode = null, nextNode: TomeNode = null): NodeChangeType {
        if (prevNode && !nextNode) {
            return REMOVE;
        }

        if (nextNode && !prevNode) {
            return ADD;
        }

        if (
            prevNode && nextNode &&
            prevNode.childNodes.length === 0 && nextNode.childNodes.length === 0
        ) {
            // Text nodes

            return prevNode.text === nextNode.text ? NONE : UPDATE_TEXT;
        }

        // HTML elements

        const hasChildChanges = getHasChildChanges(prevNode, nextNode);

        if (prevNode.tag !== nextNode.tag) {
            return hasChildChanges ? UPDATE_ALL : UPDATE_TAG;
        }

        return hasChildChanges ? UPDATE_CHILDREN : NONE;
    }
}

export default TreeDiffPatch;