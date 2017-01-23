class State {
    constructor() {
        this.text = '';
        this.markups = [];
        this.selection = [];

        Object.seal(this);
    }

    get length() {
        return this.text.length;
    }
}

export default State;