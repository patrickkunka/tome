import merge from 'helpful-merge';

import MarkupTag     from '../Constants/MarkupTag';
import State         from '../State';
import cloneMarkup   from '../Util/cloneMarkup';
import ingestMarkups from '../Util/ingestMarkups';

function removeInlineMarkup(prevState: State, tag: MarkupTag, from: number, to: number): State {
    const nextState = merge(new State(), prevState, true);
    const enveloped = prevState.envelopedBlockMarkups || [];

    nextState.markups = prevState.markups.map(cloneMarkup);

    if (enveloped.length > 1) {
        // Split and delegate the command for multiple enveloped blocks

        nextState.envelopedBlockMarkups.length = 0;

        return enveloped.reduce((localNextState, markup, i) => {
            const formatFrom = i === 0 ? from : markup.start;
            const formatTo   = i === enveloped.length - 1 ? to : markup.end;

            return removeInlineMarkup(localNextState, tag, formatFrom, formatTo);
        }, nextState);
    }

    ingestMarkups(nextState.markups, tag, from, to);

    return nextState;
}

export default removeInlineMarkup;