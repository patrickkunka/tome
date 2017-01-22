class State {
    constructor() {
        this.text = '';
        this.markups = [];
        this.selection = [];

        Object.seal(this);
    }
}

export default State;