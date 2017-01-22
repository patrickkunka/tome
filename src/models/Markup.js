class Markup extends Array {
    constructor([tag, start, end]) {
        super();

        this[0] = tag;
        this[1] = start;
        this[2] = end;

        Object.defineProperties(this, {
            type: {
                get() {
                    return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'].indexOf(this[0]) > -1 ? 'block' : 'inline';
                }
            },
            isBlock: {
                get() {
                    return this.type === 'block';
                }
            },
            isInline: {
                get() {
                    return this.type === 'inline';
                }
            }
        });

        Object.seal(this);
    }
}

export default Markup;