import Config       from '../../Config/Root';
import EventManager from '../../Events/EventManager';
import State        from '../../State/State';
import StateManager from '../../State/StateManager';
import Tree         from '../../Tree/Tree';
import Dom          from '../Dom';

interface ITome {
    config: Config;
    dom: Dom;
    eventManager: EventManager;
    stateManager: StateManager;
    tree: Tree;

    addInlineLink(): void;
    redo(): void;
    undo(): void;
    getState(): State;
}

export default ITome;