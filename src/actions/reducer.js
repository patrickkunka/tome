import State        from '../models/State';
import Util         from '../Util';
import * as Actions from '../constants/Actions';
import Editor       from '../Editor';

export default (prevState, action) => {
    const nextState = Util.extend(new State(), prevState, true);

    switch (action.type) {
        case Actions.SET_SELECTION:
            Object.assign(nextState.selection, action.range);

            break;
        case Actions.INSERT: {
            const totalDeleted = action.range.to - action.range.from;

            let totalAdded = action.content.length;
            let adjustment = totalAdded - totalDeleted;
            let collapsed = '';
            let totalCollapsed = 0;

            nextState.text =
                prevState.text.slice(0, action.range.from) +
                action.content +
                prevState.text.slice(action.range.to);

            collapsed = Editor.collapseWhitespace(nextState.text);

            if ((totalCollapsed = nextState.text.length - collapsed.length) > 0) {
                totalAdded -= totalCollapsed;
                adjustment -= totalCollapsed;

                nextState.text = collapsed;
            }

            nextState.markups = Editor.adjustMarkups(
                prevState.markups,
                action.range.from,
                action.range.to,
                totalAdded,
                adjustment
            );

            if (action.content === '\n') {
                nextState.markups = Editor.splitMarkups(nextState.markups, action.range.from);
            } else if (action.content === '') {
                nextState.markups = Editor.joinMarkups(nextState.markups, action.range.from);
            }

            nextState.selection.from =
            nextState.selection.to   = action.range.from + totalAdded;

            break;
        }
        case Actions.BACKSPACE:

            break;
        case Actions.DELETE:

            break;
        case Actions.RETURN:

            break;
        case Actions.SHIFT_RETURN:

            break;
        default:
            return prevState;
    }

    return nextState;
};