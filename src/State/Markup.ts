import Util            from '../Util/Util';
import MarkupTag       from './Constants/MarkupTag';
import MarkupType      from './Constants/MarkupType';
import IMarkup         from './interfaces/IMarkup';

class Markup {
    public 0: MarkupTag = null;
    public 1: number    = null;
    public 2: number    = null;
    public 3?: any;

    constructor(arr: IMarkup) {
        this[0] = arr[0];
        this[1] = arr[1];
        this[2] = arr[2];

        if (typeof arr[3] !== 'undefined') {
            this[3] = arr[3];
        }

        Object.seal(this);
    }

    get tag(): MarkupTag {
        return this[0];
    }

    get start(): number {
        return this[1];
    }

    get end(): number {
        return this[2];
    }

    get data(): any {
        return typeof this[3] === 'undefined' ? null : this[3];
    }

    get type(): MarkupType {
        return Util.getMarkupType(this[0]);
    }

    get isBlock(): boolean {
        return this.type === MarkupType.BLOCK;
    }

    get isInline(): boolean {
        return this.type === MarkupType.INLINE;
    }

    get isListItem(): boolean {
        return this.type === MarkupType.LIST_ITEM;
    }

    get isSelfClosing(): boolean {
        return this.tag === MarkupTag.BR;
    }

    public toArray(): IMarkup {
        if (typeof this[3] !== 'undefined') {
            return [this[0], this[1], this[2], this[3]];
        }

        return [this[0], this[1], this[2]];
    }
}

export default Markup;