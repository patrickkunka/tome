import Markup                from '../Markup';
import cloneMarkup           from './cloneMarkup';
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

    let preserveNextBlock = false;

    for (let i = 0, markup: Markup; (markup = markups[i]); i++) {
        let newMarkup = null;
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
                !markup.isCustomBlock &&
                (markup.isBlock || markup.isListItem || (markup.isInline && totalAdded > 0))
            ) {
                // Markup should be preserved is a) is block element or list item,
                // b) is inline or and inserting

                newMarkup = cloneMarkup(markup);

                newMarkup[2] = markup.start + totalAdded;

                if (markup.isSelfClosing) newMarkup[1] = newMarkup.end;
            } else if (
                (markup.isSelfClosing || preserveNextBlock) &&
                markup.start === toIndex &&
                markup.end === toIndex
            ) {
                // Self closing markup or empty block markup to be preserved after custom block deletion

                newMarkup = cloneMarkup(markup);

                newMarkup[1] = newMarkup[2] = markup.start + adjustment;

                preserveNextBlock = false;
            } else {
                // Remove all other enveloped markups

                removeMarkup = true;

                if (markup.isCustomBlock && fromIndex === markup.start) {
                    preserveNextBlock = true;
                }
            }
        } else if (markup.start <= fromIndex && markup.end >= toIndex) {
            // Selection within markup or equal to markup

            newMarkup = cloneMarkup(markup);

            newMarkup[2] += adjustment;

            if (markup.isInline && (markup.start === fromIndex && fromIndex === toIndex)) {
                // Collapsed caret at start of inline markup

                newMarkup[1] += adjustment;
            }
        } else if (markup.start >= toIndex) {
            // Markup starts after selection

            newMarkup = cloneMarkup(markup);

            newMarkup[1] += adjustment;
            newMarkup[2] += adjustment;
        } else if (markup.isInline && fromIndex < markup.start && toIndex > markup.start && toIndex < markup.end) {
            // Selection partially envelopes inline markup from start

            newMarkup = cloneMarkup(markup);

            newMarkup[1] += (adjustment + (toIndex - markup.start));
            newMarkup[2] += adjustment;
        } else if (fromIndex > markup.start && fromIndex <= markup.end && toIndex > markup.end) {
            // Selection partially envelopes markup from end, or is at end

            if (markup.isInline) {
                // Extend inline markup to end of insertion

                newMarkup = cloneMarkup(markup);

                newMarkup[2] = fromIndex + totalAdded;
            } else {
                // Block or list item

                const closingBlockMarkup = getClosingBlockMarkup(markups, i, toIndex);

                // Extend block markup to end of closing block +/-
                // adjustment, closing markup will be removed in
                // subsequent iteration

                newMarkup = cloneMarkup(markup);

                if (closingBlockMarkup) {
                    newMarkup[2] = closingBlockMarkup.end + adjustment;

                    toRemove.push(closingBlockMarkup);
                } else {
                    newMarkup[2] += adjustment;
                }
            }
        } else {
            // use existing reference, unchanged

            newMarkup = markup;
        }

        if (
            removeMarkup ||
            newMarkup && newMarkup[1] === newMarkup[2] &&
            newMarkup.isInline &&
            !newMarkup.isSelfClosing
        ) {
            // If instructed to remove, or a collapsed inline markup, remove the markup

            continue;
        }

        newMarkups.push(newMarkup);
    }

    return newMarkups;
}

export default adjustMarkups;