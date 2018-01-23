import merge from 'helpful-merge';

import MarkupTag          from '../Constants/MarkupTag';
import Markup             from '../Markup';
import State              from '../State';
import ingestMarkups      from '../Util/ingestMarkups';

function removeInlineMarkup(prevState: State, tag: MarkupTag, from: number, to: number): State {
    const nextState = merge(new State(), prevState, true);
    const enveloped = prevState.envelopedBlockMarkups || [];

    nextState.markups = prevState.markups.map(markup => new Markup(markup.toArray()));

    if (enveloped.length > 1) {
        let formattedState = nextState;

        // Split and delegate the command

        formattedState.envelopedBlockMarkups.length = 0;

        enveloped.forEach((markup, i) => {
            const formatFrom = i === 0 ? from : markup.start;
            const formatTo   = i === enveloped.length - 1 ? to : markup.end;

            formattedState = removeInlineMarkup(formattedState, tag, formatFrom, formatTo);
        });

        return formattedState;
    }

    ingestMarkups(nextState.markups, tag, from, to);

    return nextState;
}

export default removeInlineMarkup;