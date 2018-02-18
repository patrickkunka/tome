import MarkupTag        from '../../State/Constants/MarkupTag';
import NodeChangeType   from '../Constants/NodeChangeType';
import TomeNode         from '../TomeNode';
import TreePatchCommand from '../TreePatchCommand';

interface ITreePatchCommand {
    type?: NodeChangeType;
    childCommands?: TreePatchCommand[];
    nextText?: string;
    nextTag?: MarkupTag;
    nextNode?: TomeNode;
}

export default ITreePatchCommand;