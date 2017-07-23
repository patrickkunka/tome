class Action {
    constructor() {
        this.type    = null;
        this.range   = null;
        this.content = '';

        Object.seal(this);
    }

    get isRange() {
        return this.range && this.range.from !== this.range.to;
    }
}

export default Action;