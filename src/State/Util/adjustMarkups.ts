import Markup                from '../Markup';
import getClosingBlockMarkup from './getClosingBlockMarkup';

/**
 * Adjusts the position/length of existing markups in
 * response to characters being added/removed.
 */

function adjustMarkups(
    markups:    Markup[],
    fromIndex:  number,
    toIndex:    number,
    totalAdded: number,
    adjustment: number
): Markup[] {
    const newMarkups: Markup[] = [];
    const toRemove: Markup[] = [];
    const isCollapsedRange = fromIndex === toIndex;

    for (let i = 0, markup: Markup; (markup = markups[i]); i++) {
        const newMarkup = new Markup(markup.toArray());

        let removeMarkup = false;

        if (toRemove.length > 0 && toRemove.indexOf(markup) > -1) {
            // Markup to be removed as was consumed by a previous block markup

            removeMarkup = true;
        } else if (markup.start >= fromIndex && markup.end <= toIndex) {
            // Selection completely envelopes markup

            if (!isCollapsedRange && markup.isSelfClosing && markup.start === fromIndex) {
                removeMarkup = true;
            } else if (
                markup.start === fromIndex &&
                (markup.isBlock || markup.isListItem || (markup.isInline && totalAdded > 0))
            ) {
                // Markup should be preserved is a) is block element or list item,
                // b) is inline or and inserting

                newMarkup[2] = markup.start + totalAdded;

                if (markup.isSelfClosing) newMarkup[1] = newMarkup.end;
            } else if (markup.isSelfClosing && markup.start === toIndex) {
                newMarkup[1] = newMarkup[2] = markup.start + adjustment;
            } else if (markup.isInline || markup.start > fromIndex) {
                removeMarkup = true;
            }
        } else if (markup.start <= fromIndex && markup.end >= toIndex) {
            // Selection within markup or equal to markup

            newMarkup[2] += adjustment;

            if (markup.isInline && (markup.start === fromIndex && fromIndex === toIndex)) {
                // Collapsed caret at start of inline markup

                newMarkup[1] += adjustment;
            }
        } else if (markup.start >= toIndex) {
            // Markup starts after Selection

            newMarkup[1] += adjustment;
            newMarkup[2] += adjustment;
        } else if (markup.isInline && fromIndex < markup.start && toIndex > markup.start && toIndex < markup.end) {
            // Selection partially envelopes inline markup from start

            newMarkup[1] += (adjustment + (toIndex - markup.start));
            newMarkup[2] += adjustment;
        } else if (fromIndex > markup.start && fromIndex <= markup.end && toIndex > markup.end) {
            // Selection partially envelopes markup from end, or is at end

            if (markup.isInline) {
                // Extend inline markup to end of insertion

                newMarkup[2] = fromIndex + totalAdded;
            } else {
                // Block or list item

                const closingBlockMarkup = getClosingBlockMarkup(markups, i, toIndex);

                // Extend block markup to end of closing block +/-
                // adjustment, closing markup will be removed in
                // subsequent iteration

                if (closingBlockMarkup) {
                    newMarkup[2] = closingBlockMarkup.end + adjustment;

                    toRemove.push(closingBlockMarkup);
                }
            }
        }

        // If an inline markup has collapsed, remove it

        if (newMarkup[1] === newMarkup[2] && newMarkup.isInline && !newMarkup.isSelfClosing) removeMarkup = true;

        if (!removeMarkup) {
            newMarkups.push(newMarkup);
        }
    }

    return newMarkups;
}

export default adjustMarkups;