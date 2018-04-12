import {getMarkupType} from '../Shared/Util';
import MarkupTag       from '../State/Constants/MarkupTag';
import MarkupType      from '../State/Constants/MarkupType';

class TomeNode {
    public childNodes: TomeNode[] = [];
    public parent:     TomeNode   = null;
    public start:      number     = -1;
    public end:        number     = -1;
    public tag:        MarkupTag  = null;
    public text:       string     = '';
    public path:       number[]   = [];
    public data:       any        = null;
    public index:      number     = -1;

    public get type(): MarkupType {
        return getMarkupType(this.tag);
    }

    public get isBlock(): boolean {
        return [MarkupType.BLOCK, MarkupType.CUSTOM_BLOCK].includes(this.type);
    }

    public get isCustomBlock(): boolean {
        return this.type === MarkupType.CUSTOM_BLOCK;
    }

    public get isListItem(): boolean {
        return this.type === MarkupType.LIST_ITEM;
    }

    public get isInline(): boolean {
        return this.type === MarkupType.INLINE;
    }

    public get isText(): boolean {
        return this.tag === MarkupTag.TEXT;
    }

    public get isSelfClosing(): boolean {
        return this.tag === MarkupTag.BR;
    }

    public get length(): number {
        return this.end - this.start;
    }

    public get lastChild(): TomeNode {
        return this.childNodes[this.childNodes.length - 1] || null;
    }
}

export default TomeNode;