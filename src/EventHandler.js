import Util from './Util';

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

        richTextEditor.performCommand('insert', e.key);
    }

    handleKeydown(e, richTextEditor) {
        const key = e.key.toLowerCase();

        let command = '';

        if (e.metaKey) {
            switch (key) {
                case 'a':
                    return richTextEditor.sanitizeSelection();
                case 'c':
                    command = 'copy';

                    break;
                case 'v':
                    command = 'paste';

                    break;
                case 's':
                    command = 'save';

                    break;
                case 'z':
                    return richTextEditor[e.shiftKey ? 'redo' : 'undo']();
            }
        }

        switch (key) {
            case 'enter':
                command = e.shiftKey ? 'shiftReturn' : 'return';

                break;
            case 'backspace':
                command = 'backspace';

                break;
            case 'delete':
                command = 'delete';

                break;
            case 'arrowup':
                command = EventHandler.parseArrowUp(e);

                break;
            case 'arrowdown':
                command = EventHandler.parseArrowDown(e);

                break;
            case 'arrowleft':
                command = EventHandler.parseArrowLeft(e);

                break;
            case 'arrowright':
                command = EventHandler.parseArrowRight(e);

                break;
        }

        if (!command) return;

        e.preventDefault();

        richTextEditor.performCommand(command);
    }

    static parseArrowUp(e) {
        if (e.metaKey && e.shiftKey) {
            return 'pageUpSelect';
        } else if (e.metaKey) {
            return 'pageUp';
        }

        return '';

        // or 'up' if neccessary
    }

    static parseArrowDown(e) {
        if (e.metaKey && e.shiftKey) {
            return 'pageDownSelect';
        } else if (e.metaKey) {
            return 'pageDown';
        }

        return '';

        // or 'down' if neccessary
    }

    static parseArrowLeft(e) {
        if (e.metaKey && e.shiftKey) {
            return 'homeSelect';
        } else if (e.metaKey) {
            return 'home';
        } else if (e.altKey) {
            return 'leftSkip';
        } else if (e.shiftKey) {
            return 'leftSelect';
        }

        return 'left';
    }

    static parseArrowRight(e) {
        if (e.metaKey && e.shiftKey) {
            return 'endSelect';
        } else if (e.metaKey) {
            return 'end';
        } else if (e.altKey) {
            return 'rightSkip';
        } else if (e.shiftKey) {
            return 'rightSelect';
        }

        return 'right';
    }
}

export default EventHandler;