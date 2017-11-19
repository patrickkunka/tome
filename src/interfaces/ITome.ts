import Dom from '../Dom';
import IAction from '../interfaces/IAction';

interface ITome {
    dom: Dom;
    applyAction(action: IAction);
    redo();
    undo();
}

export default ITome;