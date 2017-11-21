import Tome from './Tome';

function factory(el: HTMLElement, config: any = {}): Tome {
    const tome = new Tome(el, config);

    return tome;
}

module.exports = factory;