import ActionType from '../constants/ActionType';
import Range      from '../models/Range';

interface IAction {
    type?:    ActionType;
    range?:   Range;
    content?: string;
    tag?:     string;
}

export default IAction;