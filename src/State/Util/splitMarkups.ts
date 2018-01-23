import HtmlEntity from '../Constants/HtmlEntity';
import MarkupTag  from '../Constants/MarkupTag';
import Markup     from '../Markup';

/**
 * Splits a markup at the provided index, creating a new markup
 * of the same type starting two characters later (\n\n). Assumes the
 * addition of a block break.
 */

function splitMarkups(markups: Markup[], splitIndex: number): Markup[] {
    for (let i = 0; i < markups.length; i++) {
        const markup = markups[i];
        const originalMarkupEnd = markup.end;

        let newMarkup = null;

        if (markup.start <= splitIndex && markup.end > splitIndex) {
            const newStartIndex = splitIndex + HtmlEntity.BLOCK_BREAK.length;
            const newTag = markup.isBlock && markup.end === newStartIndex ? MarkupTag.P : markup.tag;

            let j = i + 1;
            let insertIndex = -1;

            // Contract markup

            markup[2] = splitIndex;

            if (markup.isInline && markup[1] === markup[2]) {
                // Markup has contracted into non-existence

                markups.splice(i, 1);

                i--;

                continue;
            }

            newMarkup = new Markup([newTag, newStartIndex, originalMarkupEnd]);

            // Find appropriate insertion index

            for (; j < markups.length; j++) {
                const siblingMarkup = markups[j];

                if (siblingMarkup.start === newStartIndex) {
                    insertIndex = newMarkup.isBlock ? j : j + 1;

                    break;
                } else if (siblingMarkup.start > newStartIndex) {
                    insertIndex = j;

                    break;
                }
            }

            if (insertIndex < 0) {
                // If no insert index found, insert at end

                insertIndex = j;
            }

            markups.splice(insertIndex, 0, newMarkup);
        }
    }

    return markups;
}

export default splitMarkups;