import addInlineMarkup    from '../Edits/addInlineMarkup';
import removeInlineMarkup from '../Edits/removeInlineMarkup';
import State              from '../State';

/**
 * Overrides inline markups off or on for an insertion.
 */

function overrideActiveInlineMarkups(prevState: State, nextState: State, from: number, to: number) {
    return prevState.activeInlineMarkups.overrides.reduce((_, tag) => (
        prevState.isTagActive(tag) ?
            removeInlineMarkup(nextState, tag, from, to) :
            addInlineMarkup(nextState, tag, from, to)
    ), nextState);
}

export default overrideActiveInlineMarkups;