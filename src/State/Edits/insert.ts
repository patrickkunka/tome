import HtmlEntity         from '../Constants/HtmlEntity';
import MarkupTag          from '../Constants/MarkupTag';
import ISelection         from '../Interfaces/ISelection';
import State              from '../State';
import adjustMarkups      from '../Util/adjustMarkups';
import joinMarkups        from '../Util/joinMarkups';
import sanitizeLists      from '../Util/sanitizeLists';
import setActiveMarkups   from '../Util/setActiveMarkups';
import splitMarkups       from '../Util/splitMarkups';
import addInlineMarkup    from './addInlineMarkup';
import removeInlineMarkup from './removeInlineMarkup';

/**
 * Inserts zero or more characters into a range, deleting
 * the contents of the range. Adjusts all markups affected by
 * insertion.
 */

function insert(prevState: State, range: ISelection, content: string, isPasting: boolean = false): State {
    const totalDeleted      = range.to - range.from;
    const before            = prevState.text.slice(0, range.from);
    const after             = prevState.text.slice(range.to);
    const totalAdded        = content.length;
    const adjustment        = totalAdded - totalDeleted;
    const isLineBreaking    = content === HtmlEntity.LINE_BREAK;
    const isBlockBreaking   = content === HtmlEntity.BLOCK_BREAK;
    const isDeleting        = content === '';
    const isInsertingText   = !isLineBreaking && !isBlockBreaking && !isDeleting;
    const totalTrimmed      = 0;

    let nextState = new State();

    nextState.text = before + content + after;

    nextState.markups = adjustMarkups(
        prevState.markups,
        range.from,
        range.to,
        totalAdded,
        adjustment
    );

    if (isBlockBreaking) {
        nextState.markups = splitMarkups(nextState.markups, range.from);

        // TODO: make whitespace trimming available via config

        // totalTrimmed = trimWhitespace(nextState, range.from);
    } else if (isLineBreaking) {
        nextState = addInlineMarkup(nextState, MarkupTag.BR, range.from, range.from);
    } else if (isDeleting) {
        nextState.markups = joinMarkups(nextState.markups, range.from);
        nextState.markups = joinMarkups(nextState.markups, range.to);

        sanitizeLists(nextState.markups);
    }

    nextState.selection.from =
    nextState.selection.to   = range.from + totalAdded + totalTrimmed;

    setActiveMarkups(nextState, nextState.selection);

    if (!isPasting && isInsertingText) {
        for (const tag of prevState.activeInlineMarkups.overrides) {
            if (prevState.isTagActive(tag)) {
                // Override inline markup off

                nextState = removeInlineMarkup(nextState, tag, range.from, nextState.selection.to);
            } else {
                // Override inline markup on

                nextState = addInlineMarkup(nextState, tag, range.from, nextState.selection.to);
            }
        }
    }

    if ((isBlockBreaking || isLineBreaking) && prevState.activeInlineMarkups.overrides.length > 0) {
        // Breaking, persist overrides to next state

        nextState.activeInlineMarkups.overrides = prevState.activeInlineMarkups.overrides;
    }

    return nextState;
}

export default insert;