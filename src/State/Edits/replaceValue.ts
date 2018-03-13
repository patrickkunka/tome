import IValue from '../Interfaces/IValue';
import State  from '../State';

/**
 * Replaces the entire value of the editor, and moves the caret to the end.
 */

function replaceValue(data: IValue): State {
    const nextState = new State(data);

    nextState.selection.from = nextState.selection.to = nextState.text.length;

    return nextState;
}

export default replaceValue;