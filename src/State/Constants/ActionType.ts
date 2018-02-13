enum ActionType {
    BACKSPACE           = 'BACKSPACE',
    COPY                = 'COPY',
    CHANGE_BLOCK_TYPE   = 'CHANGE_BLOCK_TYPE',
    CUT                 = 'CUT',
    DELETE              = 'DELETE',
    INSERT              = 'INSERT',
    INSERT_BLOCK_BREAK  = 'INSERT_BLOCK_BREAK',
    INSERT_LINE_BREAK   = 'INSERT_LINE_BREAK',
    MUTATE              = 'MUTATE',
    NONE                = 'NONE',
    PASTE               = 'PASTE',
    REDO                = 'REDO',
    REPLACE_VALUE       = 'REPLACE_VALUE',
    SAVE                = 'SAVE',
    SET_SELECTION       = 'SET_SELECTION',
    TOGGLE_INLINE       = 'TOGGLE_INLINE',
    UNDO                = 'UNDO'
}

export default ActionType;