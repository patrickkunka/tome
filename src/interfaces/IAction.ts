import ActionType    from '../constants/ActionType';
import TomeSelection from '../models/TomeSelection';

interface IAction {
    type?:    ActionType;
    range?:   TomeSelection;
    content?: string;
    tag?:     string;
}

export default IAction;