import TomeFacade            from './Tome/TomeFacade';
import ICustomBlockRenderers from './Tree/Interfaces/ICustomBlockRenderers';
import RendererFacade        from './Tree/RendererFacade';

interface IFactory {
    (el: HTMLElement, config: any): TomeFacade;
    createRenderer(customBlocks: ICustomBlockRenderers): RendererFacade;
}

const factory = (el: HTMLElement, config: any = {}) => {
    const tome = new TomeFacade(el, config);

    return tome;
};

(factory as IFactory).createRenderer = (
    customBlocks: ICustomBlockRenderers = {}
): RendererFacade => {
    const renderer = new RendererFacade(customBlocks);

    return renderer;
};

module.exports = factory;