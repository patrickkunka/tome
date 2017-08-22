import Node from './models/Node';
import {TEXT} from './constants/Markups';

class TreeBuilder {
    static build(root, text, markups) {
        const openMarkups = [];

        let node = root;
        let textNode = null;

        node.start = 0;
        node.end   = text.length;

        for (let i = 0; i <= text.length; i++) {
            const reOpen = [];

            let j = -1;
            let markup = null;
            let hasOpened = false;
            let hasClosed = false;

            for (j = 0; (markup = markups[j]); j++) {
                // Out of range, break

                if (markup[1] > i) break;

                // If markup end is before current index or is currently
                // open, continue

                if (markup[2] < i || openMarkups.indexOf(markup) > -1) continue;

                // Markup opens at, or is open at index (and not in open
                // markups array)

                if (textNode) {
                    // If open text node, close it before opening sibling

                    textNode = TreeBuilder.closeTextNode(textNode, text, i);
                }

                // Open a new markup at index

                const newNode = TreeBuilder.createNode(markup[0], node, i, markup[2]);

                node.childNodes.push(newNode);

                openMarkups.push(markup);

                node = newNode;

                hasOpened = true;
            }

            if (hasOpened) {
                // A markup has been opened at index

                if (textNode) {
                    // A text node exists, close it

                    textNode = TreeBuilder.closeTextNode(textNode, text, i);
                } else {
                    // A text node does not exist and we are now at a leaf,
                    // so create one

                    textNode = TreeBuilder.createTextNode(node, node.start);

                    node.childNodes.push(textNode);
                }
            }

            for (j = markups.length - 1; (markup = markups[j]); j--) {
                if (markup[2] !== i) continue;

                // Markup to be closed at index

                if (textNode) {
                    // A text node is open within the markup, close it and
                    // nullify ref

                    textNode = TreeBuilder.closeTextNode(textNode, text, i);
                }

                if (markup[1] === markup[2]) {
                    // The markup is collapsed, and has closed immediately,
                    // therefore nothing has opened at the index

                    hasOpened = false;
                }

                // For each open markup, close it until the markup to be
                // closed is found

                while (openMarkups.length > 0) {
                    const closed = openMarkups.pop();

                    if (closed !== markup) {
                        // If a child of the markup to be closed, push into
                        // `reOpen` array

                        reOpen.push(closed);
                    }

                    node.end = i;

                    node = node.parent;

                    // If at desired markup, break

                    if (closed === markup) break;
                }

                // Mark that at least one markup has been closed at index

                hasClosed = true;
            }

            while (reOpen.length > 0) {
                // Reopen each markup in the `reOpen` array

                markup = reOpen.pop();

                const newNode = TreeBuilder.createNode(markup[0], node, i, markup[2]);

                node.childNodes.push(newNode);

                openMarkups.push(markup);

                node = newNode;

                hasOpened = true;
            }

            if (i !== text.length && hasClosed && !hasOpened) {
                // A node has been closed, nothing has been opened, and not at
                // end of string, create new text node

                textNode = TreeBuilder.createTextNode(node, i);

                node.childNodes.push(textNode);
            }
        }
    }

    static createTextNode(parent, start) {
        return TreeBuilder.createNode(TEXT, parent, start, -1);
    }

    static closeTextNode(textNode, text, end) {
        textNode.end = end;

        textNode.text = text.slice(textNode.start, textNode.end);

        return null;
    }

    static createNode(tag, parent, start, end) {
        const node = new Node();

        node.tag    = tag;
        node.parent = parent;
        node.start  = start;
        node.end    = end;
        node.path   = parent.path.slice();

        node.path.push(parent.childNodes.length);

        return node;
    }
}

export default TreeBuilder;