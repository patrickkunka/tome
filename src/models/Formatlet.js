class Formatlet {
    constructor([tag, start, end]) {
        this.tag    = tag;
        this.start  = start;
        this.end    = end;

        Object.seal(this);
    }
}

export default Formatlet;