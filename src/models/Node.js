import {TEXT, H1, H2, H3, H4, H5, H6, P} from '../constants/Markups';

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
        return this.tag === TEXT;
    }

    get isBlock() {
        return [H1, H2, H3, H4, H5, H6, P].indexOf(this.tag);
    }

    get isInline() {
        return !this.isText && !this.isBlock;
    }
}

export default Node;