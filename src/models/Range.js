class Range {
    constructor(from, to) {
        this.from = from;
        this.to = to;

        Object.seal(this);
    }
}

export default Range;