import ISelection       from '../interfaces/ISelection';
import State            from '../State';
import setActiveMarkups from '../Util/setActiveMarkups';

function setSelection(prevState: State, range: ISelection): State {
    const nextState = Object.assign(new State(), prevState);

    nextState.markups = prevState.markups.slice();

    Object.assign(nextState.selection, range);

    setActiveMarkups(nextState, range);

    nextState.activeInlineMarkups.overrides.length = 0;

    return nextState;
}

export default setSelection;