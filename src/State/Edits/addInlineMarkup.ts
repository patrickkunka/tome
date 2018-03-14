// import merge from 'helpful-merge';

import MarkupTag          from '../Constants/MarkupTag';
import Markup             from '../Markup';
import State              from '../State';
import ingestMarkups      from '../Util/ingestMarkups';
import joinMarkups        from '../Util/joinMarkups';
import preCloneState      from '../Util/preCloneState';

function addInlineMarkup(
    prevState: State,
    tag:       MarkupTag,
    from:      number,
    to:        number,
    data:      any = null,
    markup:    Markup = null
): State {
    const nextState: State = preCloneState(prevState, true);
    const enveloped = prevState.envelopedBlockMarkups || [];

    let insertIndex = -1;

    if (enveloped.length > 1) {
        let formattedState = nextState;

        // Split and delegate the command

        enveloped.forEach((envelopedBlockMarkup, i) => {
            const formatFrom = i === 0 ? from : envelopedBlockMarkup.start;
            const formatTo   = i === enveloped.length - 1 ? to : envelopedBlockMarkup.end;

            if (envelopedBlockMarkup.isCustomBlock) return;

            formattedState = addInlineMarkup(
                formattedState,
                tag,
                formatFrom,
                formatTo,
                data,
                envelopedBlockMarkup
            );
        });

        return formattedState;
    }

    // Single block markup

    markup = markup || enveloped[0];

    if (markup) {
        // ensure range does not extend over breaks
        // around markups

        from = from < markup[1] ? markup[1] : from;
        to = to > markup[2] ? markup[2] : to;
    }

    // Remove all existing inline markups of type within range

    ingestMarkups(nextState.markups, tag, from, to);

    for (let i = 0, len = nextState.markups.length; i < len; i++) {
        const nextMarkup = nextState.markups[i];

        // NB: When inserting an inline markup there should always be at
        // least one block markup in the array

        insertIndex = i;

        if (nextMarkup.start > from) {
            // Markup starts after markup to insert, insert at index

            break;
        } else if (i === len - 1) {
            // Last markup, insert after

            insertIndex++;

            break;
        }
    }

    let newMarkup: Markup;

    if (data) {
        newMarkup = new Markup([tag, from, to, data]);
    } else {
        newMarkup = new Markup([tag, from, to]);
    }

    nextState.markups.splice(insertIndex, 0, newMarkup);

    joinMarkups(nextState.markups, from);
    joinMarkups(nextState.markups, to);

    return nextState;
}

export default addInlineMarkup;