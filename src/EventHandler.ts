import Util         from './Util';
import IAction      from './interfaces/IAction';
import ActionType   from './constants/ActionType';
import Keypress     from './constants/Keypress';
import MarkupTag    from './constants/MarkupTag';
import RichTextEditor from './RichTextEditor';

const SELECTION_DELAY = 10;

class EventHandler {
    editor: RichTextEditor=null;
    boundDelegator: EventListenerObject=null;

    constructor(richTextEditor: RichTextEditor) {
        this.editor = richTextEditor;
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

        fn(e);
    }

    handleKeypress(e) {
        e.preventDefault();

        this.editor.applyAction({type: ActionType.INSERT, content: e.key});
    }

    handleMouseup(e) {
        if (this.editor.dom.root !== document.activeElement) return;

        this.editor.applyAction({type: ActionType.SET_SELECTION});
    }

    handleMousedown(e) {
        this.editor.applyAction({type: ActionType.SET_SELECTION});
    }

    handleKeydown(e) {
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

                    return e.shiftKey ? this.editor.redo() : this.editor.undo();
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

        setTimeout(() => this.editor.applyAction(action), SELECTION_DELAY);
    }
}

export default EventHandler;