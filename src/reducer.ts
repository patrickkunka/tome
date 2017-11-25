import ActionType  from './constants/ActionType';
import MarkupTag   from './constants/MarkupTag';
import Editor      from './Editor';
import IAnchorData from './interfaces/IAnchorData';
import Action      from './models/Action';
import Markup      from './models/Markup';
import State       from './models/State';
import Tome        from './Tome';
import Util        from './Util';

export default (prevState: State, action: Action, tome: Tome): State|Promise<State> => {
    switch (action.type) {
        case ActionType.SET_SELECTION: {
            const nextState = Util.extend(new State(), prevState, true);

            nextState.markups = prevState.markups.map(markup => new Markup(markup.toArray()));

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
            let nextState: State;

            // TODO: if collapsed, simply change state to disable/enable active
            // markup, any further set selections will reset it as appropriate

            if (prevState.isTagActive(action.tag)) {
                nextState = Editor.removeInlineMarkup(prevState, action.tag, action.range.from, action.range.to);
            } else {
                nextState = Editor.addInlineMarkup(
                    prevState,
                    action.tag,
                    action.range.from,
                    action.range.to,
                    action.data
                );
            }

            Editor.setActiveMarkups(nextState, action.range);

            return nextState;
        }
        case ActionType.CHANGE_BLOCK_TYPE: {
            return Editor.changeBlockType(prevState, action.tag);
        }
        case ActionType.CUT:
            return prevState;
        case ActionType.COPY:
            return prevState;
        case ActionType.PASTE:
            return prevState;
        case ActionType.SAVE:
            return prevState;
        default:
            return prevState;
    }
};