import Node from './models/Node';

class TreeBuilder {
    static buildTree(text, formattings, parent, startIndex=0) {
        let lastSibling = null;

        for (let i = startIndex; i < formattings.length; i++) {
            const formatting = formattings[i];

            if (lastSibling && formatting.end <= lastSibling.end) {
                // Recurse down

                lastSibling.childNodes.length = 0;

                i = TreeBuilder.buildTree(text, formattings, lastSibling, i);
            } else if (formatting.start > parent.end) {
                // Return up

                if (lastSibling.end < parent.end) {
                    // Preceeded by text node

                    parent.childNodes.push(TreeBuilder.getNode('', lastSibling.end + 1, parent.end, text));
                }

                return i - 1;
            } else {
                const lastIndex = lastSibling ? lastSibling.end + 1 : parent.start;

                // First child or sibling

                if (formatting.start > lastIndex) {
                    // Preceeded by text node

                    parent.childNodes.push(TreeBuilder.getNode('', lastIndex, formatting.start - 1, text));
                }

                lastSibling = TreeBuilder.getNode(formatting.tag, formatting.start, formatting.end, text);

                // Create internal text node

                lastSibling.childNodes.push(TreeBuilder.getNode('', formatting.start, formatting.end, text));

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