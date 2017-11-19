import ActionType from '../constants/ActionType';
import IAction    from '../interfaces/IAction';
import Range      from './Range';

class Action implements IAction {
    type:    ActionType = null;
    range:   Range      = null;
    content: string     = '';
    tag:     string     = '';
}

export default Action;