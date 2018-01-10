import ActionType   from '../State/Constants/ActionType';
import MarkupTag    from '../State/Constants/MarkupTag';
import IAction      from '../State/Interfaces/IAction';
import ITome        from '../Tome/Interfaces/ITome';
import Util         from '../Util/Util';
import Keypress     from './Constants/Keypress';
import MutationType from './Constants/MutationType';
import IMEParser    from './IMEParser';
import IAnchorData  from './Interfaces/IAnchorData';

const SELECTION_DELAY = 10;
const ACTION_DELAY = 100;

interface IInputEvent extends UIEvent {
    data: string;
}

class EventManager {
    public root: HTMLElement = null;

    private tome:           ITome               = null;
    private boundDelegator: EventListenerObject = null;
    private observer:       MutationObserver    = null;
    private isComposing:    boolean             = false;
    private isActioning:    boolean             = false;

    constructor(tome: ITome) {
        this.tome = tome;
        this.boundDelegator = this.delegator.bind(this);
        this.observer = new MutationObserver((this.handleMutation.bind(this)));
    }

    public bindEvents(): void {
        this.root.addEventListener('keypress', this.boundDelegator);
        this.root.addEventListener('keydown', this.boundDelegator);
        this.root.addEventListener('textInput', this.boundDelegator);
        this.root.addEventListener('compositionstart', this.boundDelegator);
        this.root.addEventListener('compositionupdate', this.boundDelegator);
        this.root.addEventListener('compositionend', this.boundDelegator);
        this.root.addEventListener('mousedown', this.boundDelegator);
        this.root.addEventListener('paste', this.boundDelegator);

        window.addEventListener('mouseup', this.boundDelegator);
        document.addEventListener('selectionchange', this.boundDelegator);

        this.connectMutationObserver();
    }

    public unbindEvents(): void {
        this.root.removeEventListener('keypress', this.boundDelegator);
        this.root.removeEventListener('keydown', this.boundDelegator);
        this.root.removeEventListener('textInput', this.boundDelegator);
        this.root.removeEventListener('compositionstart', this.boundDelegator);
        this.root.removeEventListener('compositionupdate', this.boundDelegator);
        this.root.removeEventListener('compositionend', this.boundDelegator);
        this.root.removeEventListener('mousedown', this.boundDelegator);
        this.root.removeEventListener('paste', this.boundDelegator);

        window.removeEventListener('mouseup', this.boundDelegator);
        document.removeEventListener('selectionchange', this.boundDelegator);

        this.disconnectMutationObserver();
    }

    public delegator(e: Event): void {
        const eventType = e.type;
        const fn = this['handle' + Util.pascalCase(eventType)];

        if (typeof fn !== 'function') {
            throw new Error(`[EventManager] No handler found for event "${eventType}"`);
        }

        fn.call(this, e);
    }

    public connectMutationObserver() {
        this.observer.observe(this.root, {
            childList: true,
            characterData: true,
            characterDataOldValue: true,
            subtree: true
        });
    }

    public disconnectMutationObserver() {
        this.observer.disconnect();
    }

    public handleKeypress(e: KeyboardEvent): void {
        e.preventDefault();

        this.isActioning = true;

        this.tome.applyAction({type: ActionType.INSERT, content: e.key});

        setTimeout(() => (this.isActioning = false), ACTION_DELAY);
    }

    public handleMouseup(): void {
        if (this.tome.dom.root !== document.activeElement) return;

        this.tome.applyAction({type: ActionType.SET_SELECTION});
    }

    public handleSelectionchange(): void {
        // NB: This was determined the most effective way to detect
        // selection change on touch devices, however is firing in
        // reaction to programmatically seting the cursor position.
        // Currently blocked by isActioning flag, but needs further
        // investigation.

        if (this.tome.dom.root !== document.activeElement || this.isActioning) return;

        this.tome.applyAction({type: ActionType.SET_SELECTION});
    }

    public handleMousedown(): void {
        this.tome.applyAction({type: ActionType.SET_SELECTION});
    }

    public handlePaste(e: ClipboardEvent): void {
        const {clipboardData} = e;
        const text = clipboardData.getData('text/plain');
        const html = clipboardData.getData('text/html');

        this.tome.applyAction({type: ActionType.PASTE, data: {text, html}});

        e.preventDefault();
    }

    public handleTextInput(e: IInputEvent): void {
        e.preventDefault();

        if (this.isComposing) {
            // Input as side effect of composition, ignore

            return;
        }

        if (e.data !== ' ') {
            this.isActioning = true;
        }

        this.tome.applyAction({type: ActionType.INSERT, content: e.data});

        setTimeout(() => (this.isActioning = false), ACTION_DELAY);
    }

    public handleCompositionstart(): void {
        this.isComposing = true;
    }

    public handleCompositionupdate(): void {
        this.isComposing = true;
    }

    public handleCompositionend(): void {
        this.isComposing = false;
    }

    public handleMutation(mutations: MutationRecord[]) : void {
        if (this.isActioning) return;

        top:
        for (const mutation of mutations) {
            let action: IAction = null;

            switch (mutation.type) {
                case MutationType.CHARACTER_DATA:
                    action = IMEParser.handleCharacterMutation(mutation, mutations, this.tome);

                    this.tome.applyAction(action);

                    break;
                case MutationType.CHILD_LIST:
                    if (mutation.target !== this.tome.dom.root) break;

                    action = IMEParser.handleBlockMutation(mutation, mutations, this.tome);

                    if (action) this.tome.applyAction(action);

                    break top;
            }
        }

        this.isActioning = true;

        setTimeout(() => (this.isActioning = false), SELECTION_DELAY);
    }

    public handleKeydown(e: KeyboardEvent): void {
        const key = e.key.toLowerCase();

        if (key === Keypress.UNIDENTIFIED) {
            return;
        }

        let action: IAction = null;

        if (e.metaKey) {
            switch (key) {
                case Keypress.A:
                    action = {type: ActionType.SET_SELECTION};

                    break;
                case Keypress.B:
                    action = {type: ActionType.TOGGLE_INLINE, tag: MarkupTag.STRONG};

                    e.preventDefault();

                    break;
                case Keypress.I:
                    action = {type: ActionType.TOGGLE_INLINE, tag: MarkupTag.EM};

                    e.preventDefault();

                    break;
                case Keypress.X:
                    action = {type: ActionType.CUT, tag: MarkupTag.EM};

                    break;
                case Keypress.C:
                    action = {type: ActionType.COPY, tag: MarkupTag.EM};

                    break;
                case Keypress.S:
                    action = {type: ActionType.SAVE, tag: MarkupTag.EM};

                    e.preventDefault();

                    break;
                case Keypress.Z:
                    e.preventDefault();

                    this.isActioning = true;

                    e.shiftKey ? this.tome.redo() : this.tome.undo();

                    setTimeout(() => (this.isActioning = false), ACTION_DELAY);

                    return;
                case Keypress.H:
                    action = {type: ActionType.CHANGE_BLOCK_TYPE, tag: MarkupTag.H1};

                    e.preventDefault();

                    break;
                case Keypress.K: {
                    const callback = this.tome.config.callbacks.onAddAnchor;

                    e.preventDefault();

                    if (typeof callback !== 'function') {
                        throw new TypeError('[Tome] No `onAddAnchor` callback function provided');
                    }

                    const handlerAccept = (data: IAnchorData) => {
                        action = {type: ActionType.TOGGLE_INLINE, tag: MarkupTag.A, data};

                        this.tome.applyAction(action);
                    };

                    callback(handlerAccept);

                    return;
                }
            }
        }

        switch (key) {
            case Keypress.ENTER:
                action = {type: e.shiftKey ? ActionType.SHIFT_RETURN : ActionType.RETURN};

                e.preventDefault();

                break;
            case Keypress.BACKSPACE:
                action = {type: ActionType.BACKSPACE};

                e.preventDefault();

                break;
            case Keypress.DELETE:
                action = {type: ActionType.DELETE};

                e.preventDefault();

                break;
            case Keypress.ARROW_LEFT:
            case Keypress.ARROW_RIGHT:
            case Keypress.ARROW_UP:
            case Keypress.ARROW_DOWN:
                action = {type: ActionType.SET_SELECTION};

                break;
        }

        if (!action || action.type === ActionType.NONE) return;

        this.isActioning = true;

        setTimeout(() => this.tome.applyAction(action), SELECTION_DELAY);

        setTimeout(() => (this.isActioning = false), ACTION_DELAY);
    }
}

export default EventManager;