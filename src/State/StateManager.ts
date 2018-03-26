import ITome                   from '../Tome/Interfaces/ITome';
import TomeNode                from '../Tree/TomeNode';
import Action                  from './Action';
import ActionType              from './Constants/ActionType';
import HistoryManipulationType from './Constants/HistoryManipulationType';
import createStateFromAction   from './createStateFromAction';
import IAction                 from './Interfaces/IAction';
import IValue                  from './Interfaces/IValue';
import State                   from './State';
import TomeSelection           from './TomeSelection';
import getRangeFromSelection   from './Util/getRangeFromSelection';

class StateManager {
    public historyIndex: number = -1;

    private lastActionType:        ActionType = null;
    private history:               State[]    = [];
    private tome:                  ITome      = null;
    private canPushState:          boolean    = true;
    private timerIdBlockPush:      number     = null;
    private timerIdBackup:         number     = null;
    private createStateFromAction: (prevState: State, action: IAction) => State = null;
    private getRangeFromSelection: (selection: Selection, root: TomeNode) => TomeSelection;

    private static DURATION_BLOCK_PUSH = 750;
    private static DURATION_BACKUP     = 2000;

    public get state(): State {
        return this.history[this.historyIndex] || null;
    }

    constructor(
        tome: ITome,
        stateCreator = createStateFromAction,
        rangeCreator = getRangeFromSelection
    ) {
        this.tome = tome;
        this.createStateFromAction = stateCreator;
        this.getRangeFromSelection = rangeCreator;
    }

    public init(initialValue: IValue) {
        this.pushStateToHistory(new State(initialValue));

        this.renderTreeToDom(null);
    }

    public undo(): void {
        if (this.historyIndex === 0) return;

        const fn = this.tome.config.callbacks.onStateChange;
        const prevState = this.state;

        this.historyIndex--;

        this.tome.eventManager.raiseIsActioningFlag();

        this.renderTreeToDom(prevState);

        if (typeof fn === 'function') {
            fn(this.state, ActionType.UNDO);
        }

        if (this.tome.config.debug.enable) {
            console.info(`UNDO (${this.historyIndex})`);
        }
    }

    public redo(): void {
        if (this.history.length - 1 === this.historyIndex) return;

        const fn = this.tome.config.callbacks.onStateChange;
        const prevState = this.state;

        this.historyIndex++;

        this.tome.eventManager.raiseIsActioningFlag();

        this.renderTreeToDom(prevState);

        if (typeof fn === 'function') {
            fn(this.state, ActionType.REDO);
        }

        if (this.tome.config.debug.enable) {
            console.info(`REDO (${this.historyIndex})`);
        }
    }

    public applyAction(actionRaw: IAction): void {
        const action: Action = Object.assign(new Action(), actionRaw);
        const fn = this.tome.config.callbacks.onStateChange;

        action.range = this.getActionRange(action);

        // If action is invalid or futile, abort and preserve current state

        if (action.range === null) return;

        const manipulation: HistoryManipulationType = StateManager.getManipulationTypeForAction(
            action,
            this.lastActionType,
            this.canPushState
        );

        this.resetCanPushTimer();

        const prevState = this.state;
        const nextState = this.createStateFromAction(prevState, action);

        if (!(nextState instanceof State)) {
            throw new TypeError(`[Tome] Action type "${action.type.toString()}" did not return a valid state object`);
        }

        if (nextState === this.state) return;

        Object.freeze(nextState);
        Object.freeze(nextState.markups);
        Object.freeze(nextState.activeInlineMarkups);
        Object.freeze(nextState.envelopedBlockMarkups);

        // Chop off any divergent future state

        this.history.length = this.historyIndex + 1;

        // Push in new state

        switch (manipulation) {
            case HistoryManipulationType.PUSH:
                this.pushStateToHistory(nextState);

                break;
            case HistoryManipulationType.REPLACE:
                this.history[this.history.length - 1] = nextState;

                break;
        }

        this.lastActionType = action.type;

        if (
            [
                ActionType.CHANGE_BLOCK_TYPE,
                ActionType.INSERT_CUSTOM_BLOCK
            ].includes(action.type)
        ) {
            // Theses events will trigger `selectionchange` or `mutations` events.
            // Momentarily raise the `isActioning` flag to prevent it from being handled.

            this.tome.eventManager.raiseIsActioningFlag();
        }

        if (action.type !== ActionType.SET_SELECTION && action.type !== ActionType.MUTATE) {
            this.renderTreeToDom(prevState);
        } else if (action.type === ActionType.MUTATE) {
            // Update internal tree only, but do not render.

            this.tome.tree.render();
        }

        if (typeof fn === 'function') {
            fn(this.state, action.type);
        }

        if (this.tome.config.debug.enable) {
            console.info(`${manipulation} (${this.historyIndex}): ${action.type}`);
        }
    }

    private getActionRange(action: Action): TomeSelection {
        if (action.type === ActionType.SET_SELECTION) {
            // Detect new selection from browser API

            const selection = window.getSelection();

            if (
                !selection.anchorNode ||
                !this.tome.dom.root.contains(selection.anchorNode)
            ) {
                // Invalid selection, abort

                return null;
            }

            const range = this.getRangeFromSelection(selection, this.tome.tree.root);

            if (
                range.from === this.state.selection.from &&
                range.to === this.state.selection.to
            ) {
                // Futile action, abort

                return null;
            }

            return range;
        } else if (action.range) {
            // A range has been provided, coerce to type

            return Object.assign(new TomeSelection(), action.range);
        }

        // Use previous range

        return this.state.selection;
    }

    private resetCanPushTimer() {
        // Prevent multiple pushing of actions that
        // happen within 750ms of each other

        clearTimeout(this.timerIdBlockPush);

        this.canPushState = false;

        this.timerIdBlockPush = window.setTimeout(
            () => this.allowPush(),
            StateManager.DURATION_BLOCK_PUSH
        );

        // But push at least every 2 seconds to "backup"

        if (this.timerIdBackup !== null) return;

        this.timerIdBackup = window.setTimeout(() => {
            this.allowPush();

            this.timerIdBackup = null;
        }, StateManager.DURATION_BACKUP);
    }

    private allowPush() {
        this.canPushState = true;
    }

    private pushStateToHistory(nextState) {
        const {limit} = this.tome.config.history;

        if (this.historyIndex < limit - 1) {
            this.history.push(nextState);

            this.historyIndex++;
        } else {
            this.history.shift();
            this.history.push(nextState);
        }
    }

    private renderTreeToDom(prevState: State) {
        try {
            this.tome.tree.render(true);

            this.tome.tree.positionCaret(this.state.selection);
        } catch (err) {
            if (this.tome.config.debug.enable) {
                console.error('[StateManager] Error while transitioning between states:', prevState, this.state);
            }

            throw err;
        }
    }

    private static getManipulationTypeForAction(
        action: IAction,
        lastActionType: ActionType,
        canPushState: boolean
    ): HistoryManipulationType {
        switch (action.type) {
            case ActionType.INSERT:
                if (
                    canPushState ||
                    [
                        ActionType.DELETE,
                        ActionType.BACKSPACE,
                        ActionType.CUT
                    ].includes(lastActionType)
                ) {
                    break;
                }

                return HistoryManipulationType.REPLACE;
            case ActionType.DELETE:
            case ActionType.BACKSPACE:
                if (
                    canPushState ||
                    [
                        ActionType.INSERT,
                        ActionType.PASTE
                    ].includes(lastActionType)
                ) {
                    break;
                }

                return HistoryManipulationType.REPLACE;
            case ActionType.SET_SELECTION:
                const {type} = action.data;

                if (type === 'keydown') {
                    return HistoryManipulationType.REPLACE;
                }

                return HistoryManipulationType.PUSH;
            case ActionType.TOGGLE_INLINE:
                if (action.range.isCollapsed) {
                    return HistoryManipulationType.REPLACE;
                }

                return HistoryManipulationType.PUSH;
        }

        return HistoryManipulationType.PUSH;
    }
}

export default StateManager;