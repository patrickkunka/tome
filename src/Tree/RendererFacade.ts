import IValue                from '../State/Interfaces/IValue';
import ICustomBlockRenderers from './Interfaces/ICustomBlockRenderers';
import IModule               from './Interfaces/IModule';
import Renderer              from './Renderer';
import TomeNode              from './TomeNode';

class RendererFacade {
    public renderValueToHtml:    (value: IValue)  => string;
    public renderTreeToHtml:     (root: TomeNode) => string;
    public renderValueToModules: (value: IValue)  => IModule[];
    public renderTreeToModules:  (root: TomeNode) => IModule[];

    constructor(customBlocks: ICustomBlockRenderers) {
        const _ = new Renderer(customBlocks);

        this.renderValueToHtml    = _.renderValueToHtml.bind(_);
        this.renderTreeToHtml     = _.renderTreeToHtml.bind(_);
        this.renderValueToModules = _.renderValueToModules.bind(_);
        this.renderTreeToModules  = _.renderTreeToModules.bind(_);

        Object.seal(this);
    }
}

export default RendererFacade;