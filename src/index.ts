import TomeFacade     from './Tome/TomeFacade';
import IModule        from './Tree/Interfaces/IModule';
import valueToModules from './Tree/Renderers/valueToModules';

interface IFactory {
    (el: HTMLElement, config: any): TomeFacade;
    valueToModules: (IValue) => IModule[];
}

const factory = (el: HTMLElement, config: any = {}) => {
    const tome = new TomeFacade(el, config);

    return tome;
};

(factory as IFactory).valueToModules = valueToModules;

module.exports = factory;