import Action              from './Action';
import ActionType          from './Constants/ActionType';
import backspace           from './Edits/backspace';
import changeBlockType     from './Edits/changeBlockType';
import del                 from './Edits/del';
import editAnchor          from './Edits/editAnchor';
import insert              from './Edits/insert';
import insertBlockBreak    from './Edits/insertBlockBreak';
import insertCustomBlock   from './Edits/insertCustomBlock';
import insertFromClipboard from './Edits/insertFromClipboard';
import insertLineBreak     from './Edits/insertLineBreak';
import moveCustomBlock     from './Edits/moveCustomBlock';
import removeCustomBlock   from './Edits/removeCustomBlock';
import replaceValue        from './Edits/replaceValue';
import setSelection        from './Edits/setSelection';
import toggleInline        from './Edits/toggleInline';
import State               from './State';

function createStateFromAction(prevState: State, action: Action): State {
    switch (action.type) {
        case ActionType.BACKSPACE:
            return backspace(prevState, action.range);
        case ActionType.CHANGE_BLOCK_TYPE:
            return changeBlockType(prevState, action.tag, action.range);
        case ActionType.COPY:
            return prevState;
        case ActionType.CUT:
            return insert(prevState, action.range);
        case ActionType.DELETE:
            return del(prevState, action.range);
        case ActionType.EDIT_ANCHOR:
            return editAnchor(prevState, action.data);
        case ActionType.INSERT:
            return insert(prevState, action.range, action.content);
        case ActionType.INSERT_BLOCK_BREAK:
            return insertBlockBreak(prevState, action.range);
        case ActionType.INSERT_CUSTOM_BLOCK:
            return insertCustomBlock(prevState, action.range, action.data);
        case ActionType.INSERT_LINE_BREAK:
            return insertLineBreak(prevState, action.range);
        case ActionType.MOVE_CUSTOM_BLOCK:
            return moveCustomBlock(prevState, action.data);
        case ActionType.MUTATE:
            return insert(prevState, action.range, action.content);
        case ActionType.PASTE:
            return insertFromClipboard(prevState, action.data, action.range);
        case ActionType.REPLACE_VALUE:
            return replaceValue(action.data);
        case ActionType.REMOVE_CUSTOM_BLOCK:
            return removeCustomBlock(prevState, action.data);
        case ActionType.SAVE:
            return prevState;
        case ActionType.SET_SELECTION:
            return setSelection(prevState, action.range);
        case ActionType.TOGGLE_INLINE:
            return toggleInline(prevState, action);
        default:
            return prevState;
    }
}

export default createStateFromAction;