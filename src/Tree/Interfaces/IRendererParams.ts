import RenderMode           from '../Constants/RenderMode';
import ICustomBlockInstance from './ICustomBlockInstance';

interface IRendererParams {
    customBlockInstances?: ICustomBlockInstance[];
    mode: RenderMode;
}

export default IRendererParams;