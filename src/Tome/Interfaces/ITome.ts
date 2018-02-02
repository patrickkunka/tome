import Config       from '../../Config/ConfigRoot';
import Dom          from '../../Dom/Dom';
import State        from '../../State/State';
import StateManager from '../../State/StateManager';
import Tree         from '../../Tree/Tree';

interface ITome {
    dom: Dom;
    config: Config;
    stateManager: StateManager;
    tree: Tree;

    redo(): void;
    undo(): void;
    getState(): State;
}

export default ITome;