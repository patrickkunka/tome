import State        from '../models/State';
import Util         from '../Util';
import * as Actions from '../constants/Actions';

import {
    DIRECTION_LTR,
    DIRECTION_RTL
} from '../models/Selection';

export default (prevState, action) => {
    const nextState = Util.extend(new State(), prevState, true);

    switch (action.type) {
        case Actions.LEFT:
            if (!action.isRange && action.range.from === 0) return prevState;

            if (action.isRange) {
                nextState.selection.from =
                nextState.selection.to   = action.range.from;
            } else {
                nextState.selection.from =
                nextState.selection.to   = action.range.from - 1;
            }

            break;
        case Actions.LEFT_SELECT:
            if (action.range.from === 0) return prevState;

            if (action.isRange && prevState.selection.isLtr) {
                nextState.selection.to--;
            } else if (action.isRange && prevState.selection.isRtl) {
                nextState.selection.from--;
            } else if (!action.isRange) {
                nextState.selection.from--;
                nextState.selection.direction = DIRECTION_RTL;
            }

            break;
        case Actions.LEFT_SKIP:

            break;
        case Actions.RIGHT:
            if (!action.isRange && action.range.to === prevState.text.length) return prevState;

            if (action.isRange) {
                nextState.selection.from =
                nextState.selection.to   = action.range.to;
            } else {
                nextState.selection.from =
                nextState.selection.to   = action.range.to + 1;
            }

            break;
        case Actions.RIGHT_SELECT:
            if (action.range.to === prevState.text.length) return prevState;

            if (action.isRange && prevState.selection.isLtr) {
                nextState.selection.from++;
            } else if (action.isRange && prevState.selection.isRtl) {
                nextState.selection.to++;
            } else if (!action.isRange) {
                nextState.selection.to++;
                nextState.selection.direction = DIRECTION_LTR;
            }

            break;
        case Actions.RIGHT_SKIP:

            break;
        case Actions.HOME:

            break;
        case Actions.HOME_SELECT:

            break;
        case Actions.END:

            break;
        case Actions.END_SELECT:

            break;
        case Actions.PAGE_UP:

            break;
        case Actions.PAGE_UP_SELECT:

            break;
        case Actions.PAGE_DOWN:

            break;
        case Actions.PAGE_DOWN_SELECT:

            break;
        case Actions.INSERT:

            break;
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