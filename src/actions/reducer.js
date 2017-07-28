import State        from '../models/State';
import Util         from '../Util';
import * as Actions from '../constants/Actions';
import Editor       from '../Editor';

export default (prevState, action) => {
    switch (action.type) {
        case Actions.SET_SELECTION: {
            const nextState = Util.extend(new State(), prevState, true);

            Object.assign(nextState.selection, action.range);

            return nextState;
        }
        case Actions.INSERT: {
            return Editor.insert(prevState, {from: action.range.from, to: action.range.to}, action.content);
        }
        case Actions.BACKSPACE: {
            const fromIndex = action.range.isCollapsed ? action.range.from - 1 : action.range.from;

            // If at start, ignore

            if (action.range.to === 0) return prevState;

            return Editor.insert(prevState, {from: fromIndex, to: action.range.to}, '');
        }
        case Actions.DELETE: {
            const toIndex = action.range.isCollapsed ? action.range.from + 1 :  action.range.to;

            // If at end, ignore

            if (action.range.from === prevState.text.length) return prevState;

            return Editor.insert(prevState, {from: action.range.from, to: toIndex}, '');
        }
        case Actions.RETURN:
            return Editor.insert(prevState, action.range, '\n');
        case Actions.SHIFT_RETURN:

            break;
        default:
            return prevState;
    }
};