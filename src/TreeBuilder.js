import Node from './models/Node';

class TreeBuilder {
    static buildTree(text, markups, parent, startIndex=0) {
        let lastSibling = null;

        let path = null;
        let index = 0;

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

                    path = parent.path.slice().concat([index++]);

                    parent.childNodes.push(TreeBuilder.getNode('', lastSibling.end, parent.end, text, path));
                }

                return i - 1;
            } else {
                const lastIndex = lastSibling ? lastSibling.end + 1 : parent.start;

                // First child or sibling

                if (markup[1] > lastIndex) {
                    // Preceeded by text node

                    path = parent.path.slice().concat([index++]);

                    parent.childNodes.push(TreeBuilder.getNode('', lastIndex, markup[1], text, path));
                }

                path = parent.path.slice().concat([index++]);

                lastSibling = TreeBuilder.getNode(markup[0], markup[1], markup[2], text, path);

                // Create internal text node

                path = path.slice().concat(0);

                lastSibling.childNodes.push(TreeBuilder.getNode('', markup[1], markup[2], text, path));

                parent.childNodes.push(lastSibling);
            }
        }
    }

    static getNode(tag, start, end, text, path) {
        const node = new Node();

        node.tag = tag;
        node.start = start;
        node.end = end;
        node.path = path;

        if (!tag) {
            node.text = text.slice(start, end);
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