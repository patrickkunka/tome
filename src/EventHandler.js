import Util         from './Util';
import * as Actions from './constants/Actions';
import * as Keys    from './constants/Keys';

import {STRONG, EM} from './constants/Markups';

class EventHandler {
    bindEvents(root, richTextEditor) {
        this.delegator = this.delegator.bind(this, richTextEditor);

        root.addEventListener('keypress', this.delegator);
        root.addEventListener('keydown', this.delegator);
        root.addEventListener('mousedown', this.delegator);
        window.addEventListener('mouseup', this.delegator);
    }

    unbindEvents(root) {
        root.removeEventListener('keypress', this.delegator);
        root.removeEventListener('keydown', this.delegator);
        root.removeEventListener('click', this.delegator);
        root.addEventListener('mousedown', this.delegator);
        window.addEventListener('mouseup', this.delegator);
    }

    delegator(richTextEditor, e) {
        const eventType = e.type;
        const fn = this['handle' + Util.pascalCase(eventType)];

        if (typeof fn !== 'function') {
            throw new Error(`[EventHandler] No handler found for event "${eventType}"`);
        }

        fn(e, richTextEditor);
    }

    handleKeypress(e, richTextEditor) {
        e.preventDefault();

        richTextEditor.applyAction({type: Actions.INSERT, content: e.key});
    }

    handleMouseup(e, richTextEditor) {
        if (richTextEditor.dom.root !== document.activeElement) return;

        richTextEditor.applyAction({type: Actions.SET_SELECTION});
    }

    handleMousedown(e, richTextEditor) {
        richTextEditor.applyAction({type: Actions.SET_SELECTION});
    }

    handleKeydown(e, richTextEditor) {
        const key = e.key.toLowerCase();

        let action = {};

        if (e.metaKey) {
            switch (key) {
                case Keys.A:
                    action = {type: Actions.SET_SELECTION};

                    break;
                case Keys.B:
                    action = {type: Actions.TOGGLE_INLINE, tag: STRONG};

                    e.preventDefault();

                    break;
                case Keys.I:
                    action = {type: Actions.TOGGLE_INLINE, tag: EM};

                    e.preventDefault();

                    break;
                // case Keys.C:
                //    command = 'copy';

                //     break;
                // case Keys.V:
                //     command = 'paste';

                //     break;
                // case Keys.S:
                //     command = 'save';

                //     break;
                case Keys.Z:
                    e.preventDefault();

                    return e.shiftKey ? richTextEditor.redo() : richTextEditor.undo();
            }
        }

        switch (key) {
            case Keys.ENTER:
                action = {type: e.shiftKey ? Actions.SHIFT_RETURN : Actions.RETURN};

                e.preventDefault();

                break;
            case Keys.BACKSPACE:
                action = {type: Actions.BACKSPACE};

                e.preventDefault();

                break;
            case Keys.DELETE:
                action = {type: Actions.DELETE};

                e.preventDefault();

                break;
            case Keys.ARROW_LEFT:
            case Keys.ARROW_RIGHT:
            case Keys.ARROW_UP:
            case Keys.ARROW_DOWN:
                action = {type: Actions.SET_SELECTION};

                break;
        }

        if (!action || action.type === Actions.NONE) return;

        setTimeout(() => richTextEditor.applyAction(action), EventHandler.SELECTION_DELAY);
    }
}

EventHandler.SELECTION_DELAY = 10;

export default EventHandler;