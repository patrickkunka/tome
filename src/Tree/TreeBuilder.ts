import MarkupTag from '../State/Constants/MarkupTag';
import Markup    from '../State/Markup';
import TomeNode  from '../Tree/TomeNode';

class TreeBuilder {
    public static build(root: TomeNode, text: string, markups: Markup[]): void {
        const openMarkups: Markup[] = [];

        let node:     TomeNode = root;
        let textNode: TomeNode = null;

        node.start = 0;
        node.end   = text.length;

        for (let characterIndex = 0; characterIndex <= text.length; characterIndex++) {
            const reOpen: Markup[] = [];

            let j: number;
            let markup: Markup;
            let hasOpened = false;
            let hasClosed = false;

            for (j = 0; (markup = markups[j]); j++) {
                // If markup starts after current index, break iteration at this index

                if (markup.start > characterIndex) break;

                // If markup end is before current index or is currently
                // open, continue

                if (markup.end < characterIndex || openMarkups.indexOf(markup) > -1) continue;

                // Markup opens at, or is open at index (and not in open
                // markups array)

                if (textNode) {
                    // If open text node, close it before opening sibling

                    textNode = TreeBuilder.closeTextNode(textNode, text, characterIndex);
                }

                // Open a new markup at index

                const newNode = TreeBuilder.createNode(markup.tag, node, characterIndex, markup.end, markup.data);

                // Add the markup's index to the virtual node

                newNode.index = j;

                node.childNodes.push(newNode);

                openMarkups.push(markup);

                node = newNode;

                hasOpened = true;
            }

            if (hasOpened && !textNode && !node.isSelfClosing) {
                // A markup has been opened at index, a text node does
                // not exist and we are now at a leaf, so create a new
                // text node

                textNode = TreeBuilder.createTextNode(node, node.start);

                node.childNodes.push(textNode);
            }

            for (j = markups.length - 1; (markup = markups[j]); j--) {
                if (markup.end !== characterIndex) continue;

                // Markup to be closed at index

                if (textNode) {
                    // A text node is open within the markup, close it and
                    // nullify ref

                    textNode = TreeBuilder.closeTextNode(textNode, text, characterIndex);
                }

                if (markup.start === markup.end) {
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

                    node.end = characterIndex;

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

                const newNode = TreeBuilder.createNode(markup.tag, node, characterIndex, markup.end);

                node.childNodes.push(newNode);

                openMarkups.push(markup);

                node = newNode;

                hasOpened = true;
            }

            if ((characterIndex !== text.length && hasClosed && !hasOpened) || (hasOpened && !textNode)) {
                // Node closed and nothing to be opened, or node (re)opened

                textNode = TreeBuilder.createTextNode(node, characterIndex);

                node.childNodes.push(textNode);
            }
        }
    }

    private static createTextNode(parent: TomeNode, start: number): TomeNode {
        return TreeBuilder.createNode(MarkupTag.TEXT, parent, start, -1);
    }

    private static closeTextNode(textNode: TomeNode, text: string, end: number): null {
        textNode.end = end;

        textNode.text = text.slice(textNode.start, textNode.end);

        return null;
    }

    private static createNode(
        tag: MarkupTag,
        parent: TomeNode,
        start: number,
        end: number,
        data: any = null
    ): TomeNode {
        const node = new TomeNode();

        node.tag    = tag;
        node.parent = parent;
        node.start  = start;
        node.end    = end;
        node.path   = parent.path.slice();
        node.data   = data;

        node.path.push(parent.childNodes.length);

        return node;
    }
}

export default TreeBuilder;