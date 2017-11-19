import MarkupTag from '../constants/MarkupTag';

class TomeNode {
    childNodes: Array<TomeNode> = [];
    parent:     TomeNode        = null;
    start:      number          = -1;
    end:        number          = -1;
    tag:        MarkupTag       = null;
    text:       string          = '';
    path:       Array<number>   = [];

    get isText() {
        return this.tag === MarkupTag.TEXT;
    }

    get isBlock() {
        return [
            MarkupTag.H1,
            MarkupTag.H2,
            MarkupTag.H3,
            MarkupTag.H4,
            MarkupTag.H5,
            MarkupTag.H6,
            MarkupTag.P
        ].indexOf(this.tag) > -1;
    }

    get isInline() {
        return !this.isText && !this.isBlock;
    }
}

export default TomeNode;