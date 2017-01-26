class Node {
    constructor() {
        this.childNodes = [];
        this.parent     = null;
        this.start      = -1;
        this.end        = -1;
        this.tag        = '';
        this.text       = '';
        this.path       = [];

        Object.seal(this);
    }

    get isText() {
        return this.tag === '';
    }

    get isBlock() {
        return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].indexOf(this.tag);
    }

    get isInline() {
        return !this.isText && !this.isBlock;
    }
}

export default Node;