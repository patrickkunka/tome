import Config    from '../config/ConfigRoot';
import Dom       from '../Dom';
import IAction   from '../interfaces/IAction';
import INodeLike from '../interfaces/INodeLike';
import TomeNode  from '../models/TomeNode';

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