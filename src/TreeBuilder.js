import Node from './models/Node';

class TreeBuilder {
    static buildTree(text, markups, parent, startIndex=0) {
        let lastSibling = null;

        for (let i = startIndex; i < markups.length; i++) {
            const markup = markups[i];

            if (lastSibling && markup[2] <= lastSibling.end) {
                // Recurse down

                lastSibling.childNodes.length = 0;

                i = TreeBuilder.buildTree(text, markups, lastSibling, i);
            } else if (markup[1] > parent.end) {
                // Return up

                if (lastSibling.end < parent.end) {
                    // Preceeded by text node

                    parent.childNodes.push(TreeBuilder.getNode('', lastSibling.end + 1, parent.end, text));
                }

                return i - 1;
            } else {
                const lastIndex = lastSibling ? lastSibling.end + 1 : parent.start;

                // First child or sibling

                if (markup[1] > lastIndex) {
                    // Preceeded by text node

                    parent.childNodes.push(TreeBuilder.getNode('', lastIndex, markup[1] - 1, text));
                }

                lastSibling = TreeBuilder.getNode(markup[0], markup[1], markup[2], text);

                // Create internal text node

                lastSibling.childNodes.push(TreeBuilder.getNode('', markup[1], markup[2], text));

                parent.childNodes.push(lastSibling);
            }
        }
    }

    static getNode(tag, start, end, text) {
        const node = new Node();

        node.tag = tag;
        node.start = start;
        node.end = end;

        if (!tag) {
            node.text = text.slice(start, end + 1);
        }

        return node;
    }

    static insertCharacters(characters, range) {
        if (range.from.node === range.to.node) {
            const node = range.from.node;


            // Same node

            node.text = node.text.slice(0, range.from.offset) + characters + node.text.slice(range.to.offset);
        }

        // TODO: increment all start/end values in subsequent nodes

        // TODO: return closest common ancestor node for re-rendering (not in this class)
    }
}

export default TreeBuilder;