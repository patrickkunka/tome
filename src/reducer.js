import State        from './models/State';
import Util         from './Util';
import ActionType   from './constants/ActionType';
import Editor       from './Editor';

export default (prevState, action) => {
    switch (action.type) {
        case ActionType.SET_SELECTION: {
            const nextState = Util.extend(new State(), prevState, true);

            Object.assign(nextState.selection, action.range);

            Editor.setActiveMarkups(nextState, action.range);

            return nextState;
        }
        case ActionType.INSERT: {
            return Editor.insert(prevState, {from: action.range.from, to: action.range.to}, action.content);
        }
        case ActionType.BACKSPACE: {
            const fromIndex = action.range.isCollapsed ? action.range.from - 1 : action.range.from;

            // If at start, ignore

            if (action.range.to === 0) return prevState;

            return Editor.insert(prevState, {from: fromIndex, to: action.range.to}, '');
        }
        case ActionType.DELETE: {
            const toIndex = action.range.isCollapsed ? action.range.from + 1 :  action.range.to;

            // If at end, ignore

            if (action.range.from === prevState.text.length) return prevState;

            return Editor.insert(prevState, {from: action.range.from, to: toIndex}, '');
        }
        case ActionType.RETURN:
            return Editor.insert(prevState, action.range, '\n');
        case ActionType.SHIFT_RETURN:

            break;
        case ActionType.TOGGLE_INLINE: {
            let nextState = null;

            // TODO: if collapsed, simply change state to disable/enable active
            // markup, any further set selections will reset it as appropriate

            if (prevState.isTagActive(action.tag)) {
                nextState = Editor.removeInlineMarkup(prevState, action.tag, action.range.from, action.range.to);
            } else {
                nextState = Editor.addInlineMarkup(prevState, action.tag, action.range.from, action.range.to);
            }

            Editor.setActiveMarkups(nextState, action.range);

            return nextState;
        }
        default:
            return prevState;
    }
};