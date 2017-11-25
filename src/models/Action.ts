import ActionType    from '../constants/ActionType';
import MarkupTag     from '../constants/MarkupTag';
import IAction       from '../interfaces/IAction';
import TomeSelection from './TomeSelection';

class Action implements IAction {
    public type:    ActionType    = null;
    public range:   TomeSelection = null;
    public tag:     MarkupTag     = null;
    public content: string        = '';
    public data:    any           = null;
}

export default Action;