class Range {
    constructor(from=-1, to=-1) {
        this.from   = from;
        this.to     = to;

        Object.seal(this);
    }
}

export default Range;