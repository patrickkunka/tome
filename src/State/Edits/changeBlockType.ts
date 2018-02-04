import merge from 'helpful-merge';

import MarkupTag from '../Constants/MarkupTag';
import Markup    from '../Markup';
import State     from '../State';

/**
 * Changes the currently active block markup to the provided tag.
 */

function changeBlockType(prevState: State, tag: MarkupTag): State {
    const nextState = merge(new State(), prevState, true);

    let newTag = tag;
    let wrappingList = null;
    let firstEnvelopedBlockIndex = -1;

    if (tag === MarkupTag.OL || tag === MarkupTag.UL) {
        // If converting one or more blocks to a list, a wrapping <ol>
        // or <ul> is applied, and each inner block is converted to a <li>

        const {envelopedBlockMarkups} = prevState;
        const firstEnvelopedStart = envelopedBlockMarkups[0].start;
        const lastEnvelopedEnd = envelopedBlockMarkups[envelopedBlockMarkups.length - 1].end;

        wrappingList = new Markup([tag, firstEnvelopedStart, lastEnvelopedEnd]);

        newTag = MarkupTag.LI;
    }

    // TODO: add configuration option to strip inline markups from non-
    // paragraph blocks

    nextState.markups = prevState.markups.map((prevMarkup, i) => {
        const nextMarkup = new Markup(prevMarkup.toArray());

        if (prevState.envelopedBlockMarkups.indexOf(prevMarkup) > -1) {
            if (firstEnvelopedBlockIndex < 0) {
                firstEnvelopedBlockIndex = i;
            }

            // If markup is enveloped, change its tag

            nextMarkup[0] = newTag;
        }

        return nextMarkup;
    });

    if (wrappingList) {
        nextState.markups.splice(firstEnvelopedBlockIndex, 0, wrappingList);
    }

    return nextState;
}

export default changeBlockType;