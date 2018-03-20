import TreePatchCommand from '../TreePatchCommand';
import ITreePatchParams from './ITreePatchParams';

type ITreePatchOperation = (
    params: ITreePatchParams,
    currentNode: Node,
    currentCommand: TreePatchCommand
) => void;

export default ITreePatchOperation;