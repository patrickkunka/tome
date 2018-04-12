import {getMarkupType} from '../Shared/Util';
import MarkupTag       from './Constants/MarkupTag';
import MarkupType      from './Constants/MarkupType';
import IMarkup         from './interfaces/IMarkup';

class Markup {
    public 0: MarkupTag = null;
    public 1: number    = null;
    public 2: number    = null;
    public 3?: any;

    constructor(arr: IMarkup) {
        this[0] = (arr[0] as MarkupTag);
        this[1] = arr[1];
        this[2] = arr[2];

        if (typeof arr[3] !== 'undefined') {
            this[3] = arr[3];
        }

        Object.seal(this);
    }

    public get tag(): MarkupTag {
        return this[0];
    }

    public get start(): number {
        return this[1];
    }

    public get end(): number {
        return this[2];
    }

    public get length(): number {
        return this.end - this.start;
    }

    public get isEmpty(): boolean {
        return this.length === 0;
    }

    public get data(): any {
        return typeof this[3] === 'undefined' ? null : this[3];
    }

    public get type(): MarkupType {
        return getMarkupType(this[0]);
    }

    public get isBlock(): boolean {
        return [MarkupType.BLOCK, MarkupType.CUSTOM_BLOCK].includes(this.type);
    }

    public get isCustomBlock(): boolean {
        return this.type === MarkupType.CUSTOM_BLOCK;
    }

    public get isInline(): boolean {
        return this.type === MarkupType.INLINE;
    }

    public get isListItem(): boolean {
        return this.type === MarkupType.LIST_ITEM;
    }

    public get isList(): boolean {
        return [MarkupTag.OL, MarkupTag.UL].includes(this.tag);
    }

    public get isSelfClosing(): boolean {
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