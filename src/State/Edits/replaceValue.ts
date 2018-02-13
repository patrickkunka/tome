import IValue from '../Interfaces/IValue';
import State  from '../State';

function replaceValue(data: IValue): State {
    const nextState = new State(data);

    nextState.selection.from = nextState.selection.to = nextState.text.length;

    return nextState;
}

export default replaceValue;