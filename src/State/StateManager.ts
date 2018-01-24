import ITome                   from '../Tome/Interfaces/ITome';
import Caret                   from '../Tree/Caret';
import TomeNode                from '../Tree/TomeNode';
import Util                    from '../Util/Util';
import Action                  from './Action';
import ActionType              from './Constants/ActionType';
import HistoryManipulationType from './Constants/HistoryManipulationType';
import SelectionDirection      from './Constants/SelectionDirection';
import IAction                 from './Interfaces/IAction';
import IValue                  from './Interfaces/IValue';
import reducer                 from './reducer';
import State                   from './State';
import TomeSelection           from './TomeSelection';

class StateManager {
    private lastActionType: ActionType = null;
    private history:          State[] = [];
    private historyIndex:     number  = -1;
    private tome:             ITome   = null;
    private canPushState:     boolean = true;
    private timerIdBlockPush: number  = null;
    private timerIdBackup:    number  = null;

    private static DURATION_BLOCK_PUSH = 750;
    private static DURATION_BACKUP = 2000;

    public get state(): State {
        return this.history[this.historyIndex];
    }

    constructor(tome: ITome) {
        this.tome = tome;
    }

    public init(initialValue: IValue) {
        this.history.push(new State(initialValue));

        this.historyIndex++;
    }

    public undo(): void {
        if (this.historyIndex === 0) return;

        const fn = this.tome.config.callbacks.onStateChange;

        this.historyIndex--;

        this.tome.render(true);

        this.tome.positionCaret(this.state.selection);

        if (typeof fn === 'function') {
            fn(this.state, ActionType.UNDO);
        }
    }

    public redo(): void {
        if (this.history.length - 1 === this.historyIndex) return;

        const fn = this.tome.config.callbacks.onStateChange;

        this.historyIndex++;

        this.tome.render(true);

        this.tome.positionCaret(this.state.selection);

        if (typeof fn === 'function') {
            fn(this.state, ActionType.REDO);
        }
    }

    public applyAction(actionRaw: IAction): void {
        const action: Action = Object.assign(new Action(), actionRaw);
        const fn = this.tome.config.callbacks.onStateChange;

        let manipulation: HistoryManipulationType = HistoryManipulationType.PUSH;

        if (action.type === ActionType.SET_SELECTION) {
            // Detect new selection from browser API

            const selection = window.getSelection();

            if (!selection.anchorNode || !this.tome.dom.root.contains(selection.anchorNode)) return;

            action.range = this.getRangeFromSelection(selection);

            if (action.range.from === this.state.selection.from && action.range.to === this.state.selection.to) return;
        } else if (action.range) {
            // A range has been set, coerce to type

            action.range = Object.assign(new TomeSelection(), action.range);
        } else {
            // Use previous range

            action.range = this.state.selection;
        }

        manipulation = this.getManipulationTypeForActionType(action.type);

        console.info(manipulation);

        const nextState = reducer(this.state, action);

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
                this.history.push(nextState);

                this.historyIndex++;

                break;
            case HistoryManipulationType.REPLACE:
                this.history[this.history.length - 1] = nextState;

                break;
        }

        this.lastActionType = action.type;

        if (action.type !== ActionType.SET_SELECTION && action.type !== ActionType.MUTATE) {
            this.tome.render(true);

            this.tome.positionCaret(this.state.selection);
        } else if (action.type === ActionType.MUTATE) {
            // Update internal tree only, but do not render.

            this.tome.render();
        }

        if (typeof fn === 'function') {
            fn(this.state, action.type);
        }
    }

    private resetCanPushTimer() {
        clearTimeout(this.timerIdBlockPush);

        this.canPushState = false;

        this.timerIdBlockPush = window.setTimeout(
            () => this.allowPush(),
            StateManager.DURATION_BLOCK_PUSH
        );

        if (this.timerIdBackup !== null) return;

        this.timerIdBackup = window.setTimeout(() => {
            this.allowPush();

            this.timerIdBackup = null;
        }, StateManager.DURATION_BACKUP);
    }

    private allowPush() {
        this.canPushState = true;
    }

    private getManipulationTypeForActionType(actionType: ActionType): HistoryManipulationType {
        switch (actionType) {
            case ActionType.INSERT:
                if (
                    [
                        ActionType.DELETE,
                        ActionType.BACKSPACE,
                        ActionType.CUT
                    ].indexOf(this.lastActionType) > -1 ||
                    this.canPushState
                ) {
                    break;
                }

                this.resetCanPushTimer();

                return HistoryManipulationType.REPLACE;
            case ActionType.DELETE:
            case ActionType.BACKSPACE:
                if (
                    [
                        ActionType.INSERT,
                        ActionType.PASTE
                    ].indexOf(this.lastActionType) > -1 ||
                    this.canPushState
                ) {
                    break;
                }

                this.resetCanPushTimer();

                return HistoryManipulationType.REPLACE;
            case ActionType.SET_SELECTION:
                return HistoryManipulationType.REPLACE;
        }

        this.resetCanPushTimer();

        return HistoryManipulationType.PUSH;
    }

    private getRangeFromSelection(selection: Selection): TomeSelection {
        const anchorPath = this.tome.dom.getPathFromDomNode(selection.anchorNode);
        const from = new Caret();
        const to = new Caret();

        let virtualAnchorNode = Util.getNodeByPath(anchorPath, this.tome.root);
        let anchorOffset = selection.anchorOffset;
        let extentOffset = selection.extentOffset;

        if (virtualAnchorNode.isBlock && anchorOffset > 0) {
            // Caret is lodged between a safety <br> and
            // the end of block

            virtualAnchorNode = virtualAnchorNode.childNodes[anchorOffset];
            anchorOffset = virtualAnchorNode.text.length;
        }

        let extentPath = anchorPath;
        let virtualExtentNode: TomeNode = virtualAnchorNode;
        let isRtl = false;
        let rangeFrom = -1;
        let rangeTo = -1;

        if (!selection.isCollapsed) {
            extentPath = this.tome.dom.getPathFromDomNode(selection.extentNode);
            virtualExtentNode = Util.getNodeByPath(extentPath, this.tome.root);

            if (virtualExtentNode.isBlock && extentOffset > 0) {
                virtualExtentNode = virtualExtentNode.childNodes[extentOffset];

                extentOffset = virtualExtentNode.text.length;
            }
        }

        // If the anchor is greater than the extent, or both paths are equal
        // but the anchor offset is greater than the extent offset, the range
        // should be considered "RTL"

        isRtl =
            Util.isGreaterPath(anchorPath, extentPath) ||
            (!Util.isGreaterPath(extentPath, anchorPath) && selection.anchorOffset > selection.extentOffset);

        from.node   = to.node = isRtl ? virtualExtentNode : virtualAnchorNode;
        from.offset = to.offset = isRtl ? extentOffset : anchorOffset;
        from.path   = to.path = isRtl ? extentPath : anchorPath;

        if (!selection.isCollapsed) {
            to.node     = isRtl ? virtualAnchorNode : virtualExtentNode;
            to.offset   = isRtl ? anchorOffset : extentOffset;
            to.path     = isRtl ? anchorPath : extentPath;
        }

        rangeFrom = Math.min(from.node.start + from.offset, from.node.end);
        rangeTo = Math.min(to.node.start + to.offset, to.node.end);

        return new TomeSelection(rangeFrom, rangeTo, isRtl ? SelectionDirection.RTL : SelectionDirection.LTR);
    }
}

export default StateManager;