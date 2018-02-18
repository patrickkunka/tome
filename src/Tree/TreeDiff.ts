import NodeChangeType    from './Constants/NodeChangeType';
import ITreePatchCommand from './Interfaces/ITreePatchCommand';
import TomeNode          from './TomeNode';
import TreePatchCommand  from './TreePatchCommand';

const {
    NONE,
    ADD,
    REMOVE,
    UPDATE_TEXT,
    UPDATE_TAG,
    UPDATE_CHILDREN,
    UPDATE_NODE
} = NodeChangeType;

const MAX_ADD_OFFSET = 2;
const MAX_REMOVE_OFFSET = 2;

class TreeDiff {
    public static diff(prevNode: TomeNode, nextNode: TomeNode) {
        return TreeDiff.diffNodes(prevNode, nextNode);
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

        const initialDiff = TreeDiff.diffNodes(prevChild, nextChild);

        if (!initialDiff.isNone) {
            // If the intial diff yields differences

            const totalAddedNodes = TreeDiff.getTotalAddedNodes(prevChild, nextChildren, commands, nextPointer);

            if (totalAddedNodes > 0) {
                return TreeDiff.diffChildren(
                    prevChildren,
                    nextChildren,
                    commands,
                    prevPointer,
                    nextPointer + totalAddedNodes
                );
            }

            const totalRemovedNodes = TreeDiff.getTotalRemovedNodes(nextChild, prevChildren, commands, prevPointer);

            if (totalRemovedNodes > 0) {
                return TreeDiff.diffChildren(
                    prevChildren,
                    nextChildren,
                    commands,
                    prevPointer + totalRemovedNodes,
                    nextPointer
                );
            }
        }

        commands.push(initialDiff);

        return TreeDiff.diffChildren(prevChildren, nextChildren, commands, prevPointer + 1, nextPointer + 1);
    }

    private static getTotalAddedNodes(
        prevChild: TomeNode,
        nextChildren: TomeNode[],
        commands: TreePatchCommand[],
        nextPointer: number
    ): number {
        let offset = 0;
        let isEqualNode = false;

        if (!prevChild) {
            commands.push(TreeDiff.createAddCommand(nextChildren[nextPointer]));

            return 1;
        }

        while (!isEqualNode && offset <= MAX_ADD_OFFSET) {
            isEqualNode = TreeDiff.isEqualNode(prevChild, nextChildren[nextPointer + ++offset]);
        }

        if (!isEqualNode) return 0;

        let i = 0;

        while (i < offset) {
            commands.push(TreeDiff.createAddCommand(nextChildren[nextPointer + i]));

            i++;
        }

        return offset;
    }

    private static getTotalRemovedNodes(
        nextChild: TomeNode,
        prevChildren: TomeNode[],
        commands: TreePatchCommand[],
        prevPointer: number
    ): number {
        let offset = 0;
        let isEqualNode = false;

        if (!nextChild) {
            commands.push(TreeDiff.createRemoveCommand());

            return 1;
        }

        while (!isEqualNode && offset <= MAX_REMOVE_OFFSET) {
            isEqualNode = TreeDiff.isEqualNode(prevChildren[prevPointer + ++offset], nextChild);
        }

        if (!isEqualNode) return 0;

        let i = 0;

        while (i < offset) {
            commands.push(TreeDiff.createRemoveCommand());

            i++;
        }

        return offset;
    }

    private static diffNodes(prevNode: TomeNode = null, nextNode: TomeNode = null): TreePatchCommand {
        if (prevNode && !nextNode) {
            return TreeDiff.createRemoveCommand();
        } else if (nextNode && !prevNode) {
            return TreeDiff.createAddCommand(nextNode);
        } else if (
            prevNode && nextNode &&
            prevNode.childNodes.length === 0 && nextNode.childNodes.length === 0
        ) {
            // Text nodes

            return prevNode.text === nextNode.text ?
                TreeDiff.createPatchCommand() :
                TreeDiff.createUpdateTextCommand(nextNode);
        }

        // HTML elements

        const childCommands = TreeDiff.diffChildren(prevNode.childNodes, nextNode.childNodes);
        const hasChildChanges = TreeDiff.hasChildChanges(childCommands);

        if (prevNode.tag !== nextNode.tag) {
            return hasChildChanges ?
                TreeDiff.createUpdateNodeCommand(nextNode) :
                TreeDiff.createUpdateTagCommand(nextNode);
        }

        return hasChildChanges ?
            TreeDiff.createUpdateChildrenCommand(childCommands) :
            TreeDiff.createPatchCommand();
    }

    private static createAddCommand(nextNode: TomeNode): TreePatchCommand {
        return TreeDiff.createPatchCommand({
            type: ADD,
            nextNode
        });
    }

    private static createRemoveCommand(): TreePatchCommand {
        return TreeDiff.createPatchCommand({type: REMOVE});
    }

    private static createUpdateTextCommand(nextNode: TomeNode): TreePatchCommand {
        return TreeDiff.createPatchCommand({
            type: UPDATE_TEXT,
            nextText: nextNode.text
        });
    }

    private static createUpdateTagCommand(nextNode: TomeNode): TreePatchCommand {
        return TreeDiff.createPatchCommand({
            type: UPDATE_TAG,
            nextTag: nextNode.tag
        });
    }

    private static createUpdateChildrenCommand(childCommands: TreePatchCommand[]): TreePatchCommand {
        return TreeDiff.createPatchCommand({
            type: UPDATE_CHILDREN,
            childCommands
        });
    }

    private static createUpdateNodeCommand(nextNode: TomeNode): TreePatchCommand {
        return TreeDiff.createPatchCommand({
            type: UPDATE_NODE,
            nextNode
        });
    }

    private static createPatchCommand(initialData: ITreePatchCommand = null): TreePatchCommand {
        const command = new TreePatchCommand();

        return initialData ? Object.assign(command, initialData) : command;
    }

    private static hasChildChanges(childCommands) {
        return childCommands.some(childCommand => childCommand.type !== NodeChangeType.NONE);
    }

    private static isEqualNode(prevNode, nextNode) {
        return TreeDiff.diffNodes(prevNode, nextNode).type === NONE;
    }
}

export default TreeDiff;