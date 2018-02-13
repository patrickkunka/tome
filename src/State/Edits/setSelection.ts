import merge from 'helpful-merge';

import ISelection       from '../interfaces/ISelection';
import Markup           from '../Markup';
import State            from '../State';
import setActiveMarkups from '../Util/setActiveMarkups';

function setSelection(prevState: State, range: ISelection): State {
    const nextState = merge(new State(), prevState, true);

    nextState.markups = prevState.markups.map(markup => new Markup(markup.toArray()));

    Object.assign(nextState.selection, range);

    setActiveMarkups(nextState, range);

    nextState.activeInlineMarkups.overrides.length = 0;

    return nextState;
}

export default setSelection;