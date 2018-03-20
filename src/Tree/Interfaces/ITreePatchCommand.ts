import MarkupTag            from '../../State/Constants/MarkupTag';
import NodeChangeType       from '../Constants/NodeChangeType';
import TextPatchCommand     from '../TextPatchCommand';
import TomeNode             from '../TomeNode';
import TreePatchCommandList from '../TreePatchCommandList';

interface ITreePatchCommand {
    type?: NodeChangeType;
    childCommands?: TreePatchCommandList;
    textPatchCommand?: TextPatchCommand;
    nextTag?: MarkupTag;
    nextNode?: TomeNode;
    prevNode?: TomeNode;
}

export default ITreePatchCommand;