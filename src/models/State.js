import Selection from './Selection';

class State {
    constructor() {
        this.text       = '';
        this.markups    = [];
        this.selection  = new Selection();

        Object.seal(this);
    }

    get length() {
        return this.text.length;
    }
}

export default State;