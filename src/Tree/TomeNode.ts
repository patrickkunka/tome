import MarkupTag  from '../State/Constants/MarkupTag';
import MarkupType from '../State/Constants/MarkupType';
import Util       from '../Util/Util';

class TomeNode {
    public childNodes: TomeNode[] = [];
    public parent:     TomeNode   = null;
    public start:      number     = -1;
    public end:        number     = -1;
    public tag:        MarkupTag  = null;
    public text:       string     = '';
    public path:       number[]   = [];

    get type(): MarkupType {
        return Util.getMarkupType(this.tag);
    }

    get isBlock(): boolean {
        return this.type === MarkupType.BLOCK;
    }

    get isListItem(): boolean {
        return this.type === MarkupType.LIST_ITEM;
    }

    get isInline(): boolean {
        return this.type === MarkupType.INLINE;
    }

    get isText(): boolean {
        return this.tag === MarkupTag.TEXT;
    }

    get isSelfClosing(): boolean {
        return this.tag === MarkupTag.BR;
    }

    get length(): number {
        return this.end - this.start;
    }

    get lastChild(): TomeNode {
        return this.childNodes[this.childNodes.length - 1] || null;
    }
}

export default TomeNode;