import SelectionDirection from './Constants/SelectionDirection';
import ISelection         from './Interfaces/ISelection';

class TomeSelection implements ISelection {
    public from:      number;
    public to:        number;
    public direction: SelectionDirection;

    constructor(
        from: number = -1,
        to: number = -1,
        direction: SelectionDirection = SelectionDirection.LTR
    ) {
        this.from       = from;
        this.to         = to;
        this.direction  = direction;
    }

    public get isCollapsed(): boolean {
        return this.from === this.to;
    }

    public get isLtr(): boolean {
        return this.direction === SelectionDirection.LTR;
    }

    public get isRtl(): boolean {
        return this.direction === SelectionDirection.RTL;
    }

    public get isUnselected(): boolean {
        return this.from < 0 || this.to < 0;
    }

    public get anchor(): number {
        if (this.isLtr) {
            return this.from;
        }

        return this.to;
    }

    public get extent(): number {
        if (this.isLtr) {
            return this.to;
        }

        return this.from;
    }
}

export default TomeSelection;