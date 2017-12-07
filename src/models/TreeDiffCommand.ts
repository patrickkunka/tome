import TreeChangeType from './constants/TreeChangeType';

class TreeDiffCommand {
    public type: TreeChangeType;
    public childCommands: TreeDiffCommand[] = [];
}

export default TreeDiffCommand;