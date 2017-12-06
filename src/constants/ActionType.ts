enum ActionType {
    BACKSPACE           = 'BACKSPACE',
    COPY                = 'COPY',
    CHANGE_BLOCK_TYPE   = 'CHANGE_BLOCK_TYPE',
    CUT                 = 'CUT',
    DELETE              = 'DELETE',
    INSERT              = 'INSERT',
    MUTATE              = 'MUTATE',
    NONE                = 'NONE',
    PASTE               = 'PASTE',
    REDO                = 'REDO',
    RETURN              = 'RETURN',
    SAVE                = 'SAVE',
    SET_SELECTION       = 'SET_SELECTION',
    SHIFT_RETURN        = 'SHIFT_RETURN',
    TOGGLE_INLINE       = 'TOGGLE_INLINE',
    UNDO                = 'UNDO'
}

export default ActionType;