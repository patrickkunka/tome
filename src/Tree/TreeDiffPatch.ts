import TreeChangeType  from './Constants/TreeChangeType';
import TomeNode        from './TomeNode';
import TreeDiffCommand from './TreeDiffCommand';
import isEqualNode     from './Util/isEqualNode';

class TreeDiffPatch {
    public static diff(prevNode: TomeNode, nextNode: TomeNode): TreeDiffCommand {
        const command = new TreeDiffCommand();

        if (isEqualNode(prevNode, nextNode)) {
            command.type = TreeChangeType.NONE;
        } else {
            command.type = TreeChangeType.UPDATE_CONTENTS;
        }

        return command;
    }

    public static compareChildren(
        prevChildren: TomeNode[],
        nextChildren: TomeNode[]
    ): TreeDiffCommand[] {
        const commands = [];
        const totalCommands = Math.max(prevChildren.length, nextChildren.length);

        commands.length = totalCommands;

        let leftPointer: number;
        let rightPointer: number;

        for (leftPointer = 0; leftPointer < nextChildren.length; leftPointer++) {
            const prevNode = prevChildren[leftPointer];
            const nextNode = nextChildren[leftPointer];

            const command = TreeDiffPatch.diff(prevNode, nextNode);

            if (command.type === TreeChangeType.NONE) {
                commands[leftPointer] = command;
            } else {
                break;
            }
        }

        for (rightPointer = 0; rightPointer < nextChildren.length; rightPointer++) {
            const prevNode = prevChildren[prevChildren.length - 1 - rightPointer];
            const nextNode = nextChildren[nextChildren.length - 1 - rightPointer];

            const command = TreeDiffPatch.diff(prevNode, nextNode);

            if (command.type === TreeChangeType.NONE) {
                commands[commands.length - 1 - rightPointer] = command;
            } else {
                break;
            }
        }

        // is the number of nodes different?
        // have blocks been added or removed?
        // find the common sections
        // isolate affected section
        // ?

        return commands;
    }
}

export default TreeDiffPatch;