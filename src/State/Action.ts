import ActionType    from './Constants/ActionType';
import MarkupTag     from './Constants/MarkupTag';
import IAction       from './Interfaces/IAction';
import TomeSelection from './TomeSelection';

class Action implements IAction {
    public type:          ActionType    = null;
    public range:         TomeSelection = null;
    public tag:           MarkupTag     = null;
    public content:       string        = '';
    public data:          any           = null;
}

export default Action;