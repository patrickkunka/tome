import Config    from '../../Config/ConfigRoot';
import Dom       from '../../Dom/Dom';
import IAction   from '../../State/Interfaces/IAction';
import TomeNode  from '../../Tree/TomeNode';
import INodeLike from './INodeLike';

interface ITome {
    dom: Dom;
    root: TomeNode;
    config: Config;
    applyAction(action: IAction);
    redo();
    undo();
    getPathFromDomNode(domNode: Node): number[];
    getNodeByPath<T extends INodeLike>(path: number[], root: T): T;
}

export default ITome;