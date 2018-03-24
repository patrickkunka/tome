import ISelection           from '../../State/Interfaces/ISelection';
import Renderer             from '../Renderer';
import TomeNode             from '../TomeNode';
import ICustomBlockInstance from './ICustomBlockInstance';

interface ITree {
    root: TomeNode;
    renderer: Renderer;
    render(shouldRender?: boolean);
    positionCaret(selection: ISelection);
    mountCustomBlock(instance: ICustomBlockInstance);
    unmountCustomBlock(container: Node);
}

export default ITree;