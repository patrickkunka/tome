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
                    command = e.shiftKey ? 'redo' : 'undo';

                    break;
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
                if (e.metaKey) {
                    command = e.shiftKey ? 'pageUpSelect' : 'pageUp';
                } else {
                    // TODO: line up if neccessary
                    command = '';
                }

                break;
            case 'arrowdown':
                if (e.metaKey) {
                    command = e.shiftKey ? 'pageDownSelect' : 'pageDown';
                } else {
                    // TODO: line down if neccessary
                    command = '';
                }

                break;
            case 'arrowleft':
                if (e.metaKey) {
                    command = e.shiftKey ? 'homeSelect' : 'home';
                } else {
                    command = e.shiftKey ? 'leftSelect' : 'left';
                }

                break;
            case 'arrowright':
                if (e.metaKey) {
                    command = e.shiftKey ? 'endSelect' : 'end';
                } else {
                    command = e.shiftKey ? 'rightSelect' : 'right';
                }

                break;
        }

        if (!command) return;

        e.preventDefault();

        richTextEditor.performCommand(command);
    }
}

export default EventHandler;