import MarkupTag        from '../../State/Constants/MarkupTag';
import NodeChangeType   from '../Constants/NodeChangeType';
import TextPatchCommand from '../TextPatchCommand';
import TomeNode         from '../TomeNode';
import TreePatchCommand from '../TreePatchCommand';

interface ITreePatchCommand {
    type?: NodeChangeType;
    childCommands?: TreePatchCommand[];
    textPatchCommand?: TextPatchCommand;
    nextTag?: MarkupTag;
    nextNode?: TomeNode;
}

export default ITreePatchCommand;