import ActionType    from '../constants/ActionType';
import MarkupTag     from '../constants/MarkupTag';
import IAction       from '../interfaces/IAction';
import TomeSelection from './TomeSelection';

class Action implements IAction {
    type:    ActionType    = null;
    range:   TomeSelection = null;
    tag:     MarkupTag     = null;
    content: string        = '';
}

export default Action;