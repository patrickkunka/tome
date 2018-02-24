import State         from '../State';
import TomeSelection from '../TomeSelection';
import cloneMarkup   from './cloneMarkup';

/**
 * Provides a partially mapped copy of the previous state, prior to the mapping of
 * active/enveloped markups, and optionally, the markups array itself.
 */

function preCloneState(prevState: State, shouldCloneMarkups = false): State {
    const nextState: State = new State();

    nextState.text = prevState.text;
    nextState.selection = Object.assign(new TomeSelection(), prevState.selection);

    if (shouldCloneMarkups) {
        nextState.markups = prevState.markups.map(cloneMarkup);
    }

    return nextState;
}

export default preCloneState;