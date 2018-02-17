import MarkupTag      from '../State/Constants/MarkupTag';
import NodeChangeType from './Constants/NodeChangeType';

class TreePatchCommand {
    public type:          NodeChangeType     = NodeChangeType.NONE;
    public childCommands: TreePatchCommand[] = [];
    public nextText:      string             = '';
    public nextTag:       MarkupTag          = null;
}

export default TreePatchCommand;