import MarkupType     from '../Constants/MarkupType';
import IMarkupLocator from '../Interfaces/IMarkupLocator';
import Markup         from '../Markup';

/**
 * Returns the first markup of the provided type at the provided index.
 */

function getMarkupOfTypeAtIndex(markups: Markup[], type: MarkupType, index: number): IMarkupLocator {
    // TODO: could be improved with quick sort

    const locator = {
        markup: null,
        index: -1
    };

    for (let i = 0, markup; (markup = markups[i]); i++) {
        if (
            markup.type === type &&
            markup.start <= index &&
            markup.end >= index
        ) {
            locator.markup = markup;
            locator.index = i;

            return locator;
        } else if (markup.start > index) break;
    }

    return locator;
}

export default getMarkupOfTypeAtIndex;