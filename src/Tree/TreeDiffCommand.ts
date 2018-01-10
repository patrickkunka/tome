import TreeChangeType from './Constants/TreeChangeType';

class TreeDiffCommand {
    public type: TreeChangeType;
    public childCommands: TreeDiffCommand[] = [];
}

export default TreeDiffCommand;