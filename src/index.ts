import TomeFacade from './Tome/TomeFacade';

function factory(el: HTMLElement, config: any = {}): TomeFacade {
    const tome = new TomeFacade(el, config);

    return tome;
}

module.exports = factory;