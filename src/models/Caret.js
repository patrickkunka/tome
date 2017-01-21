class Caret {
    constructor() {
        this.path = null;
        this.node = null;
        this.offset = null;

        Object.seal(this);
    }
}

export default Caret;