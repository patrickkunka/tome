import ChangeType  from './constants/ChangeType';
import DiffCommand from './models/DiffCommand';

class HtmlDiffPatch {
    /**
     * Recursively diffs the structure of two equivalent DOM nodes, and
     * returns a `DiffCommand` object representing a tree of any differences.
     */

    public static diff(prev: string|Node, next: string|Node): DiffCommand {
        const ERROR_MSG = '[HTMLDiffPatch] Element must be a valid DOM string';
        const tempTag = 'div';

        let el1: Node = null;
        let el2: Node = null;
        let totalChildNodes = -1;

        // Elements may be provided as DOM strings or nodes. Convert to nodes.

        if (typeof prev === 'string') {
            const temp1 = document.createElement(tempTag);

            temp1.innerHTML = prev;

            el1 = temp1.firstElementChild;
        } else if (prev instanceof Node) {
            el1 = prev;
        } else {
            throw new TypeError(ERROR_MSG);
        }

        if (typeof next === 'string') {
            const temp2 = document.createElement(tempTag);

            temp2.innerHTML = next;

            el2 = temp2.firstElementChild;
        } else if (next instanceof Node) {
            el2 = next;
        } else {
            throw new TypeError(ERROR_MSG);
        }

        const command = new DiffCommand();

        if (el1 instanceof Text) {
            // Text nodes

            if (el1.textContent === el2.textContent) {
                command.type = ChangeType.NONE;
            } else {
                command.type = ChangeType.INNER;
                command.newTextContent = el2.textContent;
            }
        } else if (el1 instanceof HTMLElement && el2 instanceof HTMLElement) {
            // HTML Elements

            if (el1.tagName !== el2.tagName) {
                // The tag has changed between versions, so assume a
                // complete replacement of the element (further
                // diffing would be redundant)

                command.type = ChangeType.REPLACE;
                command.newEl = el2;
            } else if (el1.outerHTML === el2.outerHTML) {
                // `outerHTML` is equal, therefore both elements identical
                // and no change

                command.type = ChangeType.NONE;
            } else if (el1.innerHTML !== el2.innerHTML) {
                // `innerHTML` is not equal

                command.type = ChangeType.INNER;

                if ((totalChildNodes = el1.childNodes.length) > 0 && totalChildNodes === el2.childNodes.length) {
                    // The element has children, and has the same number of children
                    // as previous version

                    // Recursively diff each child

                    for (let i = 0, childNode; (childNode = el1.childNodes[i]); i++) {
                        command.childCommands.push(HtmlDiffPatch.diff(childNode, el2.childNodes[i]));
                    }
                } else {
                    // Each version has a different number of children, so
                    // perform a brute force `innerHTML` replace. Or we are
                    // at a leaf #text node.

                    command.newInnerHtml = el2.innerHTML;
                }
            }
        }

        return command;
    }

    /**
     * Recursively patches a given node according to a provided
     * `DiffCommand` object. Returns a reference to the updated
     * or replaced node.
     */

    public static patch(node: Node, command: DiffCommand): Node {
        if (!(node instanceof Node)) throw new TypeError('[HtmlDiffPatch] No valid DOM node provided');
        if (!(command instanceof DiffCommand)) throw new TypeError('[HtmlDiffPatch] No valid `DiffCommand` provided');

        switch (command.type) {
            case ChangeType.NONE:
                // No change

                return node;
            case ChangeType.REPLACE:
                // Replaces the node with an entirely different element

                if (node.parentElement === null) throw new TypeError('[HtmlDiffPatch] Cannot replace detached node');

                node.parentElement.replaceChild(command.newEl, node);

                return command.newEl;
            case ChangeType.INNER:
                // Change to contents of node

                if (node instanceof Text) {
                    // Node is a simple text node with no chidren, replace its
                    // `textContent` value

                    node.textContent = command.newTextContent;
                } else if (command.childCommands.length > 0) {
                    // Node is an HTML element and command has childCommands,
                    // recursively apply each child patch

                    command.childCommands.forEach((childCommand, i) => {
                        return HtmlDiffPatch.patch(node.childNodes[i], childCommand);
                    });
                } else if (node instanceof HTMLElement) {
                    // No child commands present, replace the element's
                    // `innerHTML` value

                    node.innerHTML = command.newInnerHtml;
                }

                return node;
        }
    }
}

export default HtmlDiffPatch;