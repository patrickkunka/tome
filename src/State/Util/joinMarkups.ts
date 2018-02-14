import Markup      from '../Markup';
import cloneMarkup from './cloneMarkup';

/**
 * Joins two adjacent markups at a provided (known) index.
 */

function joinMarkups(markups: Markup[], index: number): Markup[] {
    const closingInlines = {};

    // TODO: use quick search to find start index

    let closingBlock = null;

    for (let i = 0; i < markups.length; i++) {
        const markup = cloneMarkup(markups[i]);

        if (markup.end === index) {
            if (markup.isBlock || markup.isListItem) {
                // Block markup closes at index

                closingBlock = markups[i];
            } else {
                closingInlines[markup.tag] = markups[i];
            }
        } else if (markup.start === index) {
            let extend = null;

            if ((markup.isBlock || markup.isListItem) && closingBlock) {
                // Block markup opens at index, and will touch
                // previous block

                extend = closingBlock;
            } else if (markup.isInline && closingInlines[markup.tag]) {
                extend = closingInlines[markup.tag];
            }

            if (extend) {
                // Markup should be extended

                extend[2] = markup[2];

                markups.splice(i, 1);

                i--;
            }
        } else if (markup.start > index) {
            // Passed joining index, done

            break;
        }
    }

    return markups;
}

export default joinMarkups;