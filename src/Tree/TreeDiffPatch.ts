import TreeChangeType  from './Constants/TreeChangeType';
import TomeNode        from './TomeNode';
import TreeDiffCommand from './TreeDiffCommand';
import isEqualNode     from './Util/isEqualNode';

interface IContext {
    commands: TreeDiffCommand[];
    prevPointer: number;
    nextPointer: number;
}

class TreeDiffPatch {
    public static diffChildren(
        prevChildren: TomeNode[],
        nextChildren: TomeNode[],
        context: IContext = {
            commands: [],
            prevPointer: 0,
            nextPointer: 0
        }
    ): TreeDiffCommand[] {
        const command = new TreeDiffCommand();
        const prevChild = prevChildren[context.prevPointer];
        const nextChild = nextChildren[context.nextPointer];

        switch (true) {
            case isEqualNode(prevChild, nextChild):
                command.type = TreeChangeType.NONE;

                context.prevPointer++;
                context.nextPointer++;

                break;
            case !prevChild || isEqualNode(prevChild, nextChildren[context.nextPointer + 1]):
                command.type = TreeChangeType.ADD;

                context.nextPointer++;

                break;
            case !nextChild || isEqualNode(nextChild, prevChildren[context.prevPointer + 1]):
                command.type = TreeChangeType.REMOVE;

                context.prevPointer++;

                break;
            default:
                command.type = TreeChangeType.UPDATE;

                context.prevPointer++;
                context.nextPointer++;
        }

        context.commands.push(command);

        if (prevChildren[context.prevPointer] || nextChildren[context.nextPointer]) {
            return TreeDiffPatch.diffChildren(prevChildren, nextChildren, context);
        } else {
            return context.commands;
        }
    }
}

export default TreeDiffPatch;