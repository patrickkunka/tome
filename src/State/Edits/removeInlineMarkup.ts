import MarkupTag     from '../Constants/MarkupTag';
import State         from '../State';
import ingestMarkups from '../Util/ingestMarkups';
import preCloneState from '../Util/preCloneState';

function removeInlineMarkup(prevState: State, tag: MarkupTag, from: number, to: number): State {
    const nextState = preCloneState(prevState, true);
    const enveloped = prevState.envelopedBlockMarkups;

    if (enveloped.length > 1) {
        // Split and delegate the command for multiple enveloped blocks

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