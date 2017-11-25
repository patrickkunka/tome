import Config  from '../config/ConfigRoot';
import Dom     from '../Dom';
import IAction from '../interfaces/IAction';

interface ITome {
    dom: Dom;
    config: Config;
    applyAction(action: IAction);
    redo();
    undo();
}

export default ITome;