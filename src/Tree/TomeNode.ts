import MarkupTag from '../State/Constants/MarkupTag';

class TomeNode {
    public childNodes: TomeNode[] = [];
    public parent:     TomeNode   = null;
    public start:      number     = -1;
    public end:        number     = -1;
    public tag:        MarkupTag  = null;
    public text:       string     = '';
    public path:       number[]   = [];

    get isText(): boolean {
        return this.tag === MarkupTag.TEXT;
    }

    get isBlock(): boolean {
        return [
            MarkupTag.H1,
            MarkupTag.H2,
            MarkupTag.H3,
            MarkupTag.H4,
            MarkupTag.H5,
            MarkupTag.H6,
            MarkupTag.P
        ].indexOf(this.tag) > -1;
    }

    get isInline(): boolean {
        return !this.isText && !this.isBlock;
    }

    get isSelfClosing(): boolean {
        return this.tag === MarkupTag.BR;
    }
}

export default TomeNode;