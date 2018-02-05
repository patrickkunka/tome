import MarkupType from '../Constants/MarkupType';
import Markup     from '../Markup';

/**
 * Returns the first markup of the provided type at the provided index.
 */

function getMarkupOfType(markups: Markup[], type: MarkupType, index: number): Markup {
    // TODO: could be improved with quick sort

    for (const markup of markups) {
        if (
            markup.type === type &&
            markup.start <= index &&
            markup.end >= index
        ) {
            return markup;
        } else if (markup.start > index) break;
    }

    return null;
}

export default getMarkupOfType;