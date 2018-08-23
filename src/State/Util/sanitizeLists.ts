import MarkupTag from '../Constants/MarkupTag';
import Markup    from '../Markup';

/**
 * Sanitizes and makes-valid, potentially malformed
 * combinations of <ul>, <ol> and <li>.
 */

function sanitizeLists(markups: Markup[]): void {
    let lastWrappingList = null;
    let lastWrappingListTag = MarkupTag.UL;
    let lastListItem = null;

    for (let i = 0; i < markups.length; i++) {
        const markup = markups[i];

        if (markup.isInline) continue;

        switch (true) {
            case lastWrappingList && markup.isList:
                // back to back lists, or nested lists
                if (
                    lastWrappingList.tag === markup.tag ||
                    markup.start <= lastWrappingList.end
                ) {
                    i = deleteWrappingList(markups, i);
                }

                break;
            case markup.isList:
                // Wrapping list found

                lastWrappingListTag = markup.tag;
                lastWrappingList = markup;

                break;
            case lastWrappingList && markup.isListItem:
                // Adjacent list item

                if (lastWrappingList.end !== markup.end) {
                    lastWrappingList[2] = markup.end;
                }

                lastListItem = markup;

                break;
            case lastWrappingList && !markup.isListItem:
                // Non-list-item after a wrapping list

                if (!lastListItem) {
                    // Unneccessary list, delete

                    i = deleteWrappingList(markups, i, -1);
                }

                lastWrappingList = lastListItem = null;

                break;
            case !lastWrappingList && markup.isListItem:
                // Unwrapped list item

                lastWrappingList = new Markup([lastWrappingListTag, markup.start, markup.end]);

                markups.splice(i, 0, lastWrappingList);

                break;
            default:
                lastWrappingList = lastListItem = null;
        }
    }
}

function deleteWrappingList(markups: Markup[], index: number, deleteOffset: number = 0): number {
    markups.splice(index + deleteOffset, 1);

    return (index - 1) + deleteOffset;
}

export default sanitizeLists;