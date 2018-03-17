import MarkupTag  from '../../State/Constants/MarkupTag';
import MarkupType from '../../State/Constants/MarkupType';

function getMarkupType(tag: MarkupTag): MarkupType {
    switch (tag) {
        case MarkupTag.H1:
        case MarkupTag.H2:
        case MarkupTag.H3:
        case MarkupTag.H4:
        case MarkupTag.H5:
        case MarkupTag.H6:
        case MarkupTag.OL:
        case MarkupTag.UL:
        case MarkupTag.P:
            return MarkupType.BLOCK;
        case MarkupTag.LI:
            return MarkupType.LIST_ITEM;
        case MarkupTag.TEXT:
            return MarkupType.TEXT;
        case MarkupTag.A:
        case MarkupTag.BR:
        case MarkupTag.CODE:
        case MarkupTag.DEL:
        case MarkupTag.EM:
        case MarkupTag.STRONG:
        case MarkupTag.SUB:
        case MarkupTag.SUP:
            return MarkupType.INLINE;
        default:
            return MarkupType.CUSTOM_BLOCK;
    }
}

export default getMarkupType;