import ActionType from '../constants/ActionType';
import ISelection from '../interfaces/ISelection';

interface IAction {
    type?:    ActionType;
    range?:   ISelection;
    content?: string;
    tag?:     string;
    data?:    any;
}

export default IAction;