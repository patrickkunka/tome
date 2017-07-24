import Range from './Range';

class State {
    constructor() {
        this.text       = '';
        this.markups    = [];
        this.selection  = new Range();

        Object.seal(this);
    }

    get length() {
        return this.text.length;
    }
}

export default State;