import HtmlEntity   from '../Constants/HtmlEntity';
import MarkupTag    from '../Constants/MarkupTag';
import ICustomBlock from '../Interfaces/ICustomBlock';
import IMarkup      from '../Interfaces/IMarkup';
import Markup       from '../Markup';

/**
 * Splits a markup at the provided index, creating a new markup
 * of the same type starting two characters later (\n\n). Assumes the
 * addition of a block break that has already extended the containing
 * markup.
 */

function splitMarkups(markups: Markup[], splitIndex: number, customBlock: ICustomBlock = null): Markup[] {
    let listToExtend = null;
    let lastListItem = null;

    for (let i = 0; i < markups.length; i++) {
        const markup = markups[i];
        const originalMarkupEnd = markup.end;

        let newMarkup = null;

        if (markup.start <= splitIndex && markup.end > splitIndex) {
            // Iterate through any markup that envelops the split index

            const customBlockTag = customBlock ? (customBlock.type as MarkupTag) : null;

            const newStartIndex = splitIndex + HtmlEntity.BLOCK_BREAK.length;
            const newTag = markup.isBlock && markup.end === newStartIndex ?
                (customBlockTag || MarkupTag.P) : markup.tag;

            let j = i + 1;
            let insertIndex = -1;

            // Contract markup

            markup[2] = splitIndex;

            if (markup.isInline && markup.isEmpty) {
                // Markup has contracted into non-existence

                markups.splice(i, 1);

                i--;

                continue;
            } else if (markup.isList) {
                // Markup is a wrapping list element and should not be split
                // but extended

                listToExtend = markup;

                continue;
            }

            const markupArgs: IMarkup = [newTag, newStartIndex, originalMarkupEnd];

            if (customBlock && customBlock.data) {
                markupArgs[3] = customBlock.data;
            }

            newMarkup = new Markup(markupArgs);

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

        if (!listToExtend) continue;

        if (markup.isListItem) {
            lastListItem = markup;

            listToExtend[2] = lastListItem.end;
        } else {
            listToExtend = null;
        }
    }

    return markups;
}

export default splitMarkups;