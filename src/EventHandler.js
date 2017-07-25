import Util         from './Util';
import * as Actions from './constants/Actions';
import * as Keys    from './constants/Keys';

class EventHandler {
    bindEvents(root, richTextEditor) {
        this.delegator = this.delegator.bind(this, richTextEditor);

        root.addEventListener('keypress', this.delegator);
        root.addEventListener('keydown', this.delegator);
        root.addEventListener('mouseup', this.delegator);
        root.addEventListener('mousedown', this.delegator);
    }

    unbindEvents(root) {
        root.removeEventListener('keypress', this.delegator);
        root.removeEventListener('keydown', this.delegator);
        root.removeEventListener('click', this.delegator);
        root.addEventListener('mouseup', this.delegator);
        root.addEventListener('mousedown', this.delegator);
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

        richTextEditor.applyAction(Actions.INSERT, e.key);
    }

    handleMouseup(e, richTextEditor) {
        richTextEditor.applyAction(Actions.SET_SELECTION);
    }

    handleMousedown(e, richTextEditor) {
        richTextEditor.applyAction(Actions.SET_SELECTION);
    }

    handleKeydown(e, richTextEditor) {
        const key = e.key.toLowerCase();

        let actionType = '';

        if (e.metaKey) {
            switch (key) {
                case Keys.A:
                    actionType = Actions.SET_SELECTION;

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
                actionType = e.shiftKey ? Actions.SHIFT_RETURN : Actions.RETURN;

                e.preventDefault();

                break;
            case Keys.BACKSPACE:
                actionType = Actions.BACKSPACE;

                e.preventDefault();

                break;
            case Keys.DELETE:
                actionType = Actions.DELETE;

                e.preventDefault();

                break;
            case Keys.ARROW_LEFT:
            case Keys.ARROW_RIGHT:
            case Keys.ARROW_UP:
            case Keys.ARROW_DOWN:
                actionType = Actions.SET_SELECTION;

                break;
        }

        if (!actionType || actionType === Actions.NONE) return;

        richTextEditor.applyAction(actionType);
    }
}

export default EventHandler;