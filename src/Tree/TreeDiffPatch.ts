import TreeChangeType  from './Constants/TreeChangeType';
import TomeNode        from './TomeNode';
import TreeDiffCommand from './TreeDiffCommand';
import isEqualNode     from './Util/isEqualNode';

interface IPointers {
    prev: number;
    next: number;
}

class TreeDiffPatch {
    public static diffChildren(
        prevChildren: TomeNode[],
        nextChildren: TomeNode[],
        commands: TreeDiffCommand[] = [],
        pointers: IPointers = {prev: 0, next: 0}
    ): TreeDiffCommand[] {
        const command = new TreeDiffCommand();
        const prevChild = prevChildren[pointers.prev];
        const nextChild = nextChildren[pointers.next];

        switch (true) {
            case isEqualNode(prevChild, nextChild):
                command.type = TreeChangeType.NONE;

                pointers.prev++;
                pointers.next++;

                break;
            case !prevChild || isEqualNode(prevChild, nextChildren[pointers.next + 1]):
                command.type = TreeChangeType.ADD;
                pointers.next++;

                break;
            case !nextChild || isEqualNode(nextChild, prevChildren[pointers.prev + 1]):
                command.type = TreeChangeType.REMOVE;
                pointers.prev++;

                break;
            default:
                command.type = TreeChangeType.UPDATE;

                pointers.prev++;
                pointers.next++;
        }

        commands.push(command);

        if (prevChildren[pointers.prev] || nextChildren[pointers.next]) {
            return TreeDiffPatch.diffChildren(prevChildren, nextChildren, commands, pointers);
        }

        return commands;
    }
}

export default TreeDiffPatch;