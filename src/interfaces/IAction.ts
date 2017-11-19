import ActionType  from '../constants/ActionType';
import EditorRange from '../models/EditorRange';

interface IAction {
    type?:    ActionType;
    range?:   EditorRange;
    content?: string;
    tag?:     string;
}

export default IAction;