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
    for (let i = markupIndex + 1, markup; (markup = markups[i]); i++) {
        if (test(markup)) return {
            markup,
            index: i
        };
    }

    return null;
}

export default getNextMarkupOfType;