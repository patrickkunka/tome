import Config    from '../../Config/ConfigRoot';
import Dom       from '../../Dom/Dom';
import IAction   from '../../State/Interfaces/IAction';
import State     from '../../State/State';
import TomeNode  from '../../Tree/TomeNode';
import INodeLike from './INodeLike';

interface ITome {
    dom: Dom;
    root: TomeNode;
    config: Config;
    applyAction(action: IAction);
    redo();
    undo();
    getState(): State;
    getPathFromDomNode(domNode: Node): number[];
    getNodeByPath<T extends INodeLike>(path: number[], root: T): T;
}

export default ITome;