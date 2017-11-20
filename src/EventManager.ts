import Util         from './Util';
import IAction      from './interfaces/IAction';
import ITome        from './interfaces/ITome';
import ActionType   from './constants/ActionType';
import Keypress     from './constants/Keypress';
import MarkupTag    from './constants/MarkupTag';

const SELECTION_DELAY = 10;

class EventHandler {
    tome: ITome=null;
    boundDelegator: EventListenerObject=null;

    constructor(tome: ITome) {
        this.tome = tome;
        this.boundDelegator = this.delegator.bind(this);
    }

    bindEvents(root: HTMLElement): void {
        root.addEventListener('keypress', this.boundDelegator);
        root.addEventListener('keydown', this.boundDelegator);
        root.addEventListener('mousedown', this.boundDelegator);
        window.addEventListener('mouseup', this.boundDelegator);
    }

    unbindEvents(root: HTMLElement): void {
        root.removeEventListener('keypress', this.boundDelegator);
        root.removeEventListener('keydown', this.boundDelegator);
        root.removeEventListener('click', this.boundDelegator);
        root.addEventListener('mousedown', this.boundDelegator);
        window.addEventListener('mouseup', this.boundDelegator);
    }

    delegator(e: Event): void {
        const eventType = e.type;
        const fn = this['handle' + Util.pascalCase(eventType)];

        if (typeof fn !== 'function') {
            throw new Error(`[EventHandler] No handler found for event "${eventType}"`);
        }

        fn.call(this, e);
    }

    handleKeypress(e: KeyboardEvent): void {
        e.preventDefault();

        this.tome.applyAction({type: ActionType.INSERT, content: e.key});
    }

    handleMouseup(e: MouseEvent): void {
        if (this.tome.dom.root !== document.activeElement) return;

        this.tome.applyAction({type: ActionType.SET_SELECTION});
    }

    handleMousedown(e: MouseEvent): void {
        this.tome.applyAction({type: ActionType.SET_SELECTION});
    }

    handleKeydown(e: KeyboardEvent): void {
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
                // case Keypress.C:
                //    command = 'copy';

                //     break;
                // case Keypress.V:
                //     command = 'paste';

                //     break;
                // case Keypress.S:
                //     command = 'save';

                //     break;
                case Keypress.Z:
                    e.preventDefault();

                    return e.shiftKey ? this.tome.redo() : this.tome.undo();
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

export default EventHandler;