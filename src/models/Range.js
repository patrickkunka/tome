import {
    DIRECTION_LTR,
    DIRECTION_RTL
} from '../constants/Common';

class Range {
    constructor(from=-1, to=-1, direction=DIRECTION_LTR) {
        this.from       = from;
        this.to         = to;
        this.direction  = direction;

        Object.seal(this);
    }

    get isCollapsed() {
        return this.from === this.to;
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

export default Range;