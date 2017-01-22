class Node {
    constructor() {
        this.childNodes = [];
        this.start      = -1;
        this.end        = -1;
        this.tag        = '';
        this.text       = '';
        this.path       = [];

        Object.seal(this);
    }
}

export default Node;