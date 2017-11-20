import MarkupTag from '../constants/MarkupTag';
import MarkupType from '../constants/MarkupType';

class Markup {
    0:MarkupTag=null;
    1:number=null;
    2:number=null;

    constructor([tag, start, end]: [MarkupTag, number, number]) {
        this[0] = tag;
        this[1] = start;
        this[2] = end;

        Object.seal(this);
    }

    get tag() {
        return this[0];
    }

    get start() {
        return this[1];
    }

    get end() {
        return this[2]
    }

    get type() {
        return [
            MarkupTag.H1,
            MarkupTag.H2,
            MarkupTag.H3,
            MarkupTag.H4,
            MarkupTag.H5,
            MarkupTag.H6,
            MarkupTag.P
        ].indexOf(this[0]) > -1 ? MarkupType.BLOCK : MarkupType.INLINE;
    }

    get isBlock() {
        return this.type === MarkupType.BLOCK;
    }

    get isInline() {
        return this.type === MarkupType.INLINE;
    }

    toArray(): [MarkupTag, number, number] {
        return [this[0], this[1], this[2]];
    }
}

export default Markup;