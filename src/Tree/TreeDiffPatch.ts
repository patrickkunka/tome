import NodeChangeType   from './Constants/NodeChangeType';
import TomeNode         from './TomeNode';
import TreePatchCommand from './TreePatchCommand';
import getChangeType    from './Util/getChangeType';

class TreeDiffPatch {
    public static diff(prevNode: TomeNode, nextNode: TomeNode) {
        const command = new TreePatchCommand();

        command.type = getChangeType(prevNode, nextNode);
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

        if (getChangeType(prevChild, nextChild) === NodeChangeType.NONE) {
            command.type = NodeChangeType.NONE;

            return TreeDiffPatch.diffChildren(prevChildren, nextChildren, commands, prevPointer + 1, nextPointer + 1);
        } else if (!prevChild || getChangeType(prevChild, nextChildren[nextPointer + 1]) === NodeChangeType.NONE) {
            command.type = NodeChangeType.ADD;

            return TreeDiffPatch.diffChildren(prevChildren, nextChildren, commands, prevPointer, nextPointer + 1);
        } else if (!nextChild || getChangeType(nextChild, prevChildren[prevPointer + 1]) === NodeChangeType.NONE) {
            command.type = NodeChangeType.REMOVE;

            return TreeDiffPatch.diffChildren(prevChildren, nextChildren, commands, prevPointer + 1, nextPointer);
        }

        const updateCommand = TreeDiffPatch.diff(prevChild, nextChild);

        commands[commands.length - 1] = updateCommand;

        return TreeDiffPatch.diffChildren(prevChildren, nextChildren, commands, prevPointer + 1, nextPointer + 1);
    }
}

export default TreeDiffPatch;