class Action {
    constructor() {
        this.type    = null;
        this.range   = null;
        this.content = '';

        Object.seal(this);
    }
}

export default Action;