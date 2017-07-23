class Selection {
    constructor(from=-1, to=-1) {
        this.from = from;
        this.to   = to;
        this.direction = DIRECTION_LTR;
    }

    get isLtr() {
        return this.direction === DIRECTION_LTR;
    }

    get isRtl() {
        return this.direction === DIRECTION_RTL;
    }

    get anchor() {
        if (this.isLtr) {
            return this.from;
        }

        return this.to;
    }

    get extent() {
        if (this.isLtr) {
            return this.to;
        }

        return this.from;
    }
}

export const DIRECTION_LTR = Symbol('DIRECTION_LTR');
export const DIRECTION_RTL = Symbol('DIRECTION_RTL');

export default Selection;