import MarkupType     from '../Constants/MarkupType';
import IMarkupLocator from '../Interfaces/IMarkupLocator';
import Markup         from '../Markup';

/**
 * Finds the next markup of the provided type, starting from the
 * provided index.
 *
 * Returns a locator object containing the markup
 * and its index or `null`.
 */

function getNextMarkupOfType(markups: Markup[], markupType: MarkupType, markupIndex: number): IMarkupLocator {
    for (let i = markupIndex + 1, markup; (markup = markups[i]); i++) {
        if (markup.type === markupType) return {
            markup,
            index: i
        };
    }

    return null;
}

export default getNextMarkupOfType;