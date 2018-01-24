import Config       from '../../Config/ConfigRoot';
import Dom          from '../../Dom/Dom';
import ISelection   from '../../State/interfaces/ISelection';
import State        from '../../State/State';
import StateManager from '../../State/StateManager';
import TomeNode     from '../../Tree/TomeNode';

interface ITome {
    dom: Dom;
    root: TomeNode;
    config: Config;
    stateManager: StateManager;

    redo(): void;
    undo(): void;
    getState(): State;
    positionCaret(selection: ISelection): void;
    render(shouldUpdateDom?: boolean): void;
}

export default ITome;