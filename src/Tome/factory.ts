import IConfig               from '../Config/Interfaces/IConfig';
import ICustomBlockRenderers from '../Tree/Interfaces/ICustomBlockRenderers';
import RendererFacade        from '../Tree/RendererFacade';
import IFactory              from './Interfaces/IFactory';
import TomeFacade            from './TomeFacade';

const createRenderer = (customBlocks: ICustomBlockRenderers = {}): RendererFacade => {
    const renderer = new RendererFacade(customBlocks);

    return renderer;
};

const createFactory = (InjectedTomeFacade): IFactory => {
    const factory = (el: HTMLElement, config: IConfig = {}): TomeFacade => {
        const tome = new InjectedTomeFacade(el, config);

        return tome;
    };

    (factory as IFactory).createRenderer = createRenderer;

    return (factory as IFactory);
};

const boundFactory = createFactory(TomeFacade);

export {
    boundFactory as default,
    createFactory
};