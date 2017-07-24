import State        from '../models/State';
import Util         from '../Util';
import * as Actions from '../constants/Actions';

import {
    DIRECTION_LTR,
    DIRECTION_RTL
} from '../constants/Common';

export default (prevState, action) => {
    const nextState = Util.extend(new State(), prevState, true);

    switch (action.type) {
        case Actions.SET_SELECTION:
            Object.assign(nextState.selection, action.range);

            break;
        case Actions.LEFT:
            if (action.range.isCollapsed && action.range.from === 0) return prevState;

            if (action.range.isCollapsed) {
                nextState.selection.from =
                nextState.selection.to   = action.range.from - 1;
            } else {
                nextState.selection.from =
                nextState.selection.to   = action.range.from;
            }

            break;
        case Actions.LEFT_SELECT:
            if (action.range.from === 0) return prevState;

            if (!action.range.isCollapsed && prevState.selection.isLtr) {
                nextState.selection.to--;
            } else if (!action.range.isCollapsed && prevState.selection.isRtl) {
                nextState.selection.from--;
            } else if (action.range.isCollapsed) {
                nextState.selection.from--;
                nextState.selection.direction = DIRECTION_RTL;
            }

            break;
        case Actions.LEFT_SKIP:

            break;
        case Actions.RIGHT:
            if (action.range.isCollapsed && action.range.to === prevState.text.length) return prevState;

            if (action.range.isCollapsed) {
                nextState.selection.from =
                nextState.selection.to   = action.range.to + 1;
            } else {
                nextState.selection.from =
                nextState.selection.to   = action.range.to;
            }

            break;
        case Actions.RIGHT_SELECT:
            if (action.range.to === prevState.text.length) return prevState;

            if (!action.range.isCollapsed && prevState.selection.isLtr) {
                nextState.selection.to++;
            } else if (!action.range.isCollapsed && prevState.selection.isRtl) {
                nextState.selection.from++;
            } else if (action.range.isCollapsed) {
                nextState.selection.to++;
                nextState.selection.direction = DIRECTION_LTR;
            }

            break;
        case Actions.RIGHT_SKIP:

            break;
        case Actions.UP_SELECT:
            // TODO: get working with keydown, be able to move
            // up and back down etc

            if (prevState.selection.isRtl) {
                nextState.selection.from = action.range.from;
            } else if (prevState.selection.isLtr) {
                nextState.selection.to = prevState.selection.from;
                nextState.selection.from = action.range.from;
                nextState.selection.direction = DIRECTION_RTL;
            }

            break;
        case Actions.DOWN_SELECT:
            if (prevState.selection.isLtr) {
                nextState.selection.to = action.range.to;
            } else if (prevState.selection.isRtl) {
                nextState.selection.from = prevState.selection.to;
                nextState.selection.to = action.range.to;
                nextState.selection.direction = DIRECTION_LTR;
            }

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