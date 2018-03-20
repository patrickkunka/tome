import MarkupTag            from '../State/Constants/MarkupTag';
import NodeChangeType       from './Constants/NodeChangeType';
import TextPatchCommand     from './TextPatchCommand';
import TomeNode             from './TomeNode';
import TreePatchCommandList from './TreePatchCommandList';

class TreePatchCommand {
    public type:             NodeChangeType       = NodeChangeType.NONE;
    public childCommands:    TreePatchCommandList = new TreePatchCommandList();
    public textPatchCommand: TextPatchCommand     = null;
    public nextTag:          MarkupTag            = null;
    public nextNode:         TomeNode             = null;
    public prevNode:         TomeNode             = null;
    public followingCommand: TreePatchCommand     = null;

    get isNone(): boolean {
        return this.type === NodeChangeType.NONE;
    }
}

export default TreePatchCommand;