import Util         from './Util';
import * as Actions from './constants/Actions';
import * as Keys    from './constants/Keys';

class EventHandler {
    bindEvents(root, richTextEditor) {
        this.delegator = this.delegator.bind(this, richTextEditor);

        root.addEventListener('keypress', this.delegator);
        root.addEventListener('keydown', this.delegator);
        root.addEventListener('click', this.delegator);
    }

    unbindEvents(root) {
        root.removeEventListener('keypress', this.delegator);
        root.removeEventListener('keydown', this.delegator);
        root.removeEventListener('click', this.delegator);
    }

    delegator(richTextEditor, e) {
        const eventType = e.type;
        const fn = this['handle' + Util.pascalCase(eventType)];

        if (typeof fn !== 'function') {
            throw new Error(`[EventHandler] No handler found for event "${eventType}"`);
        }

        fn(e, richTextEditor);
    }

    handleClick(e, richTextEditor) {
        richTextEditor.sanitizeSelection();
    }

    handleKeypress(e, richTextEditor) {
        e.preventDefault();

        richTextEditor.applyAction(Actions.INSERT, e.key);
        // richTextEditor.performCommand('insert', e.key);
    }

    handleKeydown(e, richTextEditor) {
        const key = e.key.toLowerCase();

        let actionType = '';

        if (e.metaKey) {
            switch (key) {
                case Keys.A:
                    return richTextEditor.sanitizeSelection();
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
                    return e.shiftKey ? richTextEditor.redo() : richTextEditor.undo();
            }
        }

        switch (key) {
            case Keys.ENTER:
                actionType = e.shiftKey ? Actions.SHIFT_RETURN : Actions.RETURN;

                break;
            case Keys.BACKSPACE:
                actionType = Actions.BACKSPACE;

                break;
            case Keys.DELETE:
                actionType = Actions.DELETE;

                break;
            case Keys.ARROW_UP:
                actionType = EventHandler.parseArrowUp(e);

                break;
            case Keys.ARROW_DOWN:
                actionType = EventHandler.parseArrowDown(e);

                break;
            case Keys.ARROW_LEFT:
                actionType = EventHandler.parseArrowLeft(e);

                break;
            case Keys.ARROW_RIGHT:
                actionType = EventHandler.parseArrowRight(e);

                break;
        }

        if (!actionType || actionType === Actions.NONE) return;

        e.preventDefault();

        richTextEditor.applyAction(actionType);
    }

    static parseArrowUp(e) {
        if (e.metaKey && e.shiftKey) {
            return Actions.PAGE_UP_SELECT;
        } else if (e.metaKey) {
            return Actions.PAGE_UP;
        }

        return Actions.NONE;
    }

    static parseArrowDown(e) {
        if (e.metaKey && e.shiftKey) {
            return Actions.PAGE_DOWN_SELECT;
        } else if (e.metaKey) {
            return Actions.PAGE_DOWN;
        }

        return Actions.NONE;
    }

    static parseArrowLeft(e) {
        if (e.metaKey && e.shiftKey) {
            return Actions.HOME_SELECT;
        } else if (e.metaKey) {
            return Actions.HOME;
        } else if (e.altKey) {
            return Actions.LEFT_SKIP;
        } else if (e.shiftKey) {
            return Actions.LEFT_SELECT;
        }

        return Actions.LEFT;
    }

    static parseArrowRight(e) {
        if (e.metaKey && e.shiftKey) {
            return Actions.END_SELECT;
        } else if (e.metaKey) {
            return Actions.END;
        } else if (e.altKey) {
            return Actions.RIGHT_SKIP;
        } else if (e.shiftKey) {
            return Actions.RIGHT_SELECT;
        }

        return Actions.RIGHT;
    }
}

export default EventHandler;