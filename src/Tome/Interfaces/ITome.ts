import Config       from '../../Config/ConfigRoot';
import Dom          from '../../Dom/Dom';
import EventManager from '../../Dom/EventManager';
import State        from '../../State/State';
import StateManager from '../../State/StateManager';
import Tree         from '../../Tree/Tree';

interface ITome {
    config: Config;
    dom: Dom;
    eventManager: EventManager;
    stateManager: StateManager;
    tree: Tree;

    redo(): void;
    undo(): void;
    getState(): State;
}

export default ITome;