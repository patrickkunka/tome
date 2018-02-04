import MarkupType from '../Constants/MarkupType';
import Markup     from '../Markup';

/**
 * Returns the first markup of the provided type at the provided index.
 */

function getMarkupOfType(markups: Markup[], type: MarkupType, index: number): Markup {
    return markups.find(markup => (
        markup.type === type &&
        markup.start <= index &&
        markup.end >= index)
    ) || null;
}

export default getMarkupOfType;