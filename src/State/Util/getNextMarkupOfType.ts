import IMarkupLocator from '../Interfaces/IMarkupLocator';
import Markup         from '../Markup';

/**
 * Finds the next markup passing the provided test, starting from the
 * provided index.
 *
 * Returns a locator object containing the markup
 * and its index or `null`.
 */

function getNextMarkupOfType(
    markups: Markup[],
    test: (markup: Markup) => boolean,
    markupIndex: number
): IMarkupLocator {
    const locator = {
        markup: null,
        index: -1
    };

    for (let i = markupIndex + 1, markup; (markup = markups[i]); i++) {
        if (test(markup)) {
            locator.markup = markup;
            locator.index = i;

            return locator;
        }
    }

    return locator;
}

export default getNextMarkupOfType;