import TreeChangeType  from './Constants/TreeChangeType';
import TomeNode        from './TomeNode';
import TreeDiffCommand from './TreeDiffCommand';
import isEqualNode     from './Util/isEqualNode';

class TreeDiffPatch {
    public static diffChildren(
        prevChildren: TomeNode[],
        nextChildren: TomeNode[],
        commands: TreeDiffCommand[] = [],
        prevPointer: number = 0,
        nextPointer: number = 0
    ): TreeDiffCommand[] {
        const prevChild = prevChildren[prevPointer];
        const nextChild = nextChildren[nextPointer];

        if (!prevChild && !nextChild) return commands;

        const command = new TreeDiffCommand();

        commands.push(command);

        if (isEqualNode(prevChild, nextChild)) {
            command.type = TreeChangeType.NONE;

            return TreeDiffPatch.diffChildren(prevChildren, nextChildren, commands, prevPointer + 1, nextPointer + 1);
        } else if (!prevChild || isEqualNode(prevChild, nextChildren[nextPointer + 1])) {
            command.type = TreeChangeType.ADD;

            return TreeDiffPatch.diffChildren(prevChildren, nextChildren, commands, prevPointer, nextPointer + 1);
        } else if (!nextChild || isEqualNode(nextChild, prevChildren[prevPointer + 1])) {
            command.type = TreeChangeType.REMOVE;

            return TreeDiffPatch.diffChildren(prevChildren, nextChildren, commands, prevPointer + 1, nextPointer);
        }

        command.type = TreeChangeType.UPDATE;

        return TreeDiffPatch.diffChildren(prevChildren, nextChildren, commands, prevPointer + 1, nextPointer + 1);
    }
}

export default TreeDiffPatch;