import ActionType from '../Constants/ActionType';
import ISelection from '../interfaces/ISelection';

interface IAction {
    type?:    ActionType;
    range?:   ISelection;
    content?: string;
    tag?:     string;
    data?:    any;
}

export default IAction;