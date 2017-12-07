import TreeChangeType  from './constants/TreeChangeType';
import TomeNode        from './models/TomeNode';
import TreeDiffCommand from './models/TreeDiffCommand';

class TreeDiffPatch {
    public static diff(prev: TomeNode, next: TomeNode): TreeDiffCommand {
        const command = new TreeDiffCommand();

        // at this point we know that the node is equivalent

        if (prev === null && next instanceof TomeNode) {
            command.type = TreeChangeType.ADD;
        } else if (prev instanceof TomeNode && next === null) {
            command.type = TreeChangeType.REMOVE;
        } else if (prev instanceof TomeNode && next instanceof TomeNode) {
            if (prev.tag === next.tag && prev.text !== next.text) {
                command.type = TreeChangeType.UPDATE;
            } else if (prev.tag !== next.tag && prev.text === next.text) {
                command.type = TreeChangeType.REPLACE;
            } else {
                command.type = TreeChangeType.NONE;
            }
        }

        const maxChildren = Math.max(prev.childNodes.length, next.childNodes.length);

        if (maxChildren === 0) return command;

        TreeDiffPatch.diffChildNodes(prev.childNodes, next.childNodes, command.childCommands);

        // iterate through prev children
        // for each one, check hash against all of next children and break on first match
        // if indices are not equal, an addition, removal, or update has occured
        // once all nodes are mapped to equal nodes, we can determine the update types
        // for those that are left?
    }

    private static diffPersistantNode(prev: TomeNode, next: TomeNode, command: TreeDiffCommand): void {
        //
    }

    private static diffChildNodes(
        prevChildren:  TomeNode[],
        nextChildren:  TomeNode[],
        childCommands: TreeDiffCommand[]
    ): void {
        //
    }
}

export default TreeDiffPatch;