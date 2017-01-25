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

    get isTextNode() {
        return this.tag === '';
    }
}

export default Node;