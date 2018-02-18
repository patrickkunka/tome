import MarkupTag      from '../State/Constants/MarkupTag';
import NodeChangeType from './Constants/NodeChangeType';
import TomeNode       from './TomeNode';

class TreePatchCommand {
    public type:          NodeChangeType     = NodeChangeType.NONE;
    public childCommands: TreePatchCommand[] = [];
    public nextText:      string             = '';
    public nextTag:       MarkupTag          = null;
    public nextNode:      TomeNode           = null;

    get isNone(): boolean {
        return this.type === NodeChangeType.NONE;
    }
}

export default TreePatchCommand;