import IConfig               from './Config/Interfaces/IConfig';
import TomeFacade            from './Tome/TomeFacade';
import ICustomBlockRenderers from './Tree/Interfaces/ICustomBlockRenderers';
import RendererFacade        from './Tree/RendererFacade';

interface IFactory {
    (el: HTMLElement, config: IConfig): TomeFacade;
    createRenderer(customBlocks: ICustomBlockRenderers): RendererFacade;
}

const factory = (el: HTMLElement, config: IConfig = {}): TomeFacade => {
    const tome = new TomeFacade(el, config);

    return tome;
};

const createRenderer = (customBlocks: ICustomBlockRenderers = {}): RendererFacade => {
    const renderer = new RendererFacade(customBlocks);

    return renderer;
};

(factory as IFactory).createRenderer = createRenderer;

module.exports = factory;