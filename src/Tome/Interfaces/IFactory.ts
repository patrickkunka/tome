import IConfig               from '../../Config/Interfaces/IConfig';
import ICustomBlockRenderers from '../../Tree/Interfaces/ICustomBlockRenderers';
import RendererFacade        from '../../Tree/RendererFacade';
import TomeFacade            from '../TomeFacade';

interface IFactory {
    (el: HTMLElement, config?: IConfig): TomeFacade;
    createRenderer(customBlocks?: ICustomBlockRenderers): RendererFacade;
}

export default IFactory;