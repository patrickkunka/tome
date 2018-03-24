import Config        from '../../Config/Root';
import IEventManager from '../../Events/Interfaces/IEventManager';
import State         from '../../State/State';
import StateManager  from '../../State/StateManager';
import ITree         from '../../Tree/Interfaces/ITree';
import Dom           from '../Dom';

interface ITome {
    config: Config;
    dom: Dom;
    eventManager: IEventManager;
    stateManager: StateManager;
    tree: ITree;

    addInlineLink(): void;
    redo(): void;
    undo(): void;
    getState(): State;
}

export default ITome;