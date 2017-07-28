import * as Markups from '../constants/Markups';

class Markup extends Array {
    constructor([tag, start, end]) {
        super();

        this[0] = tag;
        this[1] = start;
        this[2] = end;

        Object.defineProperties(this, {
            tag: {
                get: () => this[0]
            },
            start: {
                get: () => this[1]
            },
            end: {
                get: () => this[2]
            },
            type: {
                get() {
                    return [
                        Markups.H1,
                        Markups.H2,
                        Markups.H3,
                        Markups.H4,
                        Markups.H5,
                        Markups.H6,
                        Markups.P
                    ].indexOf(this[0]) > -1 ? Markups.MARKUP_TYPE_BLOCK : Markups.MARKUP_TYPE_INLINE;
                }
            },
            isBlock: {
                get() {
                    return this.type === Markups.MARKUP_TYPE_BLOCK;
                }
            },
            isInline: {
                get() {
                    return this.type === Markups.MARKUP_TYPE_INLINE;
                }
            }
        });

        Object.seal(this);
    }
}

export default Markup;