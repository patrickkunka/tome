import TreePatchCommand from './TreePatchCommand';

class TypedArray {
    public length: number;

    public map<U>(_: (value: any, index: number, array: any[]) => U): U[] { return []; }
    public push(..._): number { return 0; }
}

TypedArray.prototype = new Array<TreePatchCommand>();

class TreePatchCommandList extends TypedArray {
    public last: TreePatchCommand = null;

    public push(...items): number {
        items.forEach(this.addLinkedCommand.bind(this));

        return this.length;
    }

    private addLinkedCommand(command: TreePatchCommand) {
        if (this.last) this.last.followingCommand = command;

        super.push(command);

        this.last = command;
    }
}

export default TreePatchCommandList;