import ActionType   from './constants/ActionType';
import Keypress     from './constants/Keypress';
import MarkupTag    from './constants/MarkupTag';
import IAction      from './interfaces/IAction';
import IAnchorData  from './interfaces/IAnchorData';
import ITome        from './interfaces/ITome';
import Util         from './Util';

const SELECTION_DELAY = 10;

class EventManager {
    private tome: ITome = null;
    private boundDelegator: EventListenerObject = null;

    constructor(tome: ITome) {
        this.tome = tome;
        this.boundDelegator = this.delegator.bind(this);
    }

    public bindEvents(root: HTMLElement): void {
        root.addEventListener('keypress', this.boundDelegator);
        root.addEventListener('keydown', this.boundDelegator);
        root.addEventListener('mousedown', this.boundDelegator);
        root.addEventListener('paste', this.boundDelegator);
        window.addEventListener('mouseup', this.boundDelegator);
    }

    public unbindEvents(root: HTMLElement): void {
        root.removeEventListener('keypress', this.boundDelegator);
        root.removeEventListener('keydown', this.boundDelegator);
        root.removeEventListener('mousedown', this.boundDelegator);
        root.removeEventListener('paste', this.boundDelegator);
        window.removeEventListener('mouseup', this.boundDelegator);
    }

    public delegator(e: Event): void {
        const eventType = e.type;
        const fn = this['handle' + Util.pascalCase(eventType)];

        if (typeof fn !== 'function') {
            throw new Error(`[EventManager] No handler found for event "${eventType}"`);
        }

        fn.call(this, e);
    }

    public handleKeypress(e: KeyboardEvent): void {
        e.preventDefault();

        this.tome.applyAction({type: ActionType.INSERT, content: e.key});
    }

    public handleMouseup(): void {
        if (this.tome.dom.root !== document.activeElement) return;

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

    public handleKeydown(e: KeyboardEvent): void {
        const key = e.key.toLowerCase();

        let action: IAction = {};

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

                    e.preventDefault();

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

                    return e.shiftKey ? this.tome.redo() : this.tome.undo();
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

        setTimeout(() => this.tome.applyAction(action), SELECTION_DELAY);
    }
}

export default EventManager;