import TomeFacade from './TomeFacade';

function factory(el: HTMLElement, config: any = {}): TomeFacade {
    const tome = new TomeFacade(el, config);

    return tome;
}

module.exports = factory;