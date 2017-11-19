import ActionType  from '../constants/ActionType';
import MarkupTag   from '../constants/MarkupTag';
import IAction     from '../interfaces/IAction';
import EditorRange from './EditorRange';

class Action implements IAction {
    type:    ActionType  = null;
    range:   EditorRange = null;
    tag:     MarkupTag   = null;
    content: string      = '';
}

export default Action;