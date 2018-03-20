import TypedArray from '../Shared/Util/TypedArray';
import TreePatchCommand from './TreePatchCommand';

class TreePatchCommandList extends TypedArray<TreePatchCommand> {
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