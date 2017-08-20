import Node from './models/Node';

class TreeBuilder {
    /**
     * @param   {Node}            root
     * @param   {string}          text
     * @param   {Array.<Markup>}  markups
     * @return  {void}
     */

    static buildTreeFromRoot(root, text, markups) {
        const openNodes = [];
        const openMarkups = [];

        let isAtLeaf = false;
        let node = root;

        node.start = 0;
        node.end = text.length;

        // Iterate through characters in text string

        for (let i = 0; i <= text.length; i++) {
            let requiresNewLeaf = false;

            for (let j = 0, markup; (markup = markups[j]); j++) {
                let closedMarkup = null;
                let closedNode = null;

                // If markup does not end at index, or collapsed
                // markup, continue

                if (markup[2] !== i || markup[1] === markup[2]) continue;

                // If is at leaf, and last open node is a text node

                if (isAtLeaf && openNodes[openNodes.length - 1].isText) {
                    // Close leaf node

                    const textNode = openNodes.pop();

                    TreeBuilder.closeNode(textNode, i, text);

                    isAtLeaf = false;
                }

                // Close last open node

                requiresNewLeaf = true;

                while ((closedNode = openNodes.pop())) {
                    closedMarkup = openMarkups.pop();

                    TreeBuilder.closeNode(closedNode, i);

                    // Go up until node and all child nodes have been closed

                    node = closedNode.parent;

                    if (closedMarkup === markup) break;
                }
            }

            for (let j = 0, markup; (markup = markups[j]); j++) {
                let newNode = null;

                // If markup does not envelop index, is collapsed at index,
                // or is already open, continue

                if (markup[1] > i || (markup[2] <= i && markup[2] !== markup[1]) || openMarkups.indexOf(markup) > -1) continue;

                if (isAtLeaf) {
                    // If at leaf, close leaf

                    const textNode = openNodes.pop();

                    TreeBuilder.closeNode(textNode, i, text);

                    isAtLeaf = false;
                }

                // Open node at index

                newNode = TreeBuilder.getOpenNode(markup[0], i, node);

                // Push into open tracking array

                openNodes.push(newNode);
                openMarkups.push(markup);

                // Push into parent's children

                node.childNodes.push(newNode);

                // Make new node current node

                node = newNode;

                // Flag leaf required

                requiresNewLeaf = true;

                if (markup[1] === markup[2]) {
                    // Empty tag, close immediately

                    TreeBuilder.closeNode(node, i);
                }
            }

            if (!requiresNewLeaf) continue;

            if (node.start === node.end) {
                // Empty leaf in empty node, close immediately

                const leaf = TreeBuilder.getOpenNode('#text', i, node);

                node.childNodes.push(leaf);

                TreeBuilder.closeNode(leaf, i);

                while (node.parent && node.start === node.end) {
                    // While in empty node, go up

                    node = node.parent;

                    openNodes.pop();
                    openMarkups.pop();
                }
            }

            if (i < text.length) {
                // Should open leaf node, but yet not at end of string

                const leaf = TreeBuilder.getOpenNode('#text', i, node);

                node.childNodes.push(leaf);

                openNodes.push(leaf);

                isAtLeaf = true;

                requiresNewLeaf = false;
            }
        }
    }

    /**
     * @param   {string}    tag
     * @param   {number}    i
     * @param   {Node}      parent
     * @return  {Node}
     */

    static getOpenNode(tag, start, parent) {
        const node = new Node();

        node.tag    = tag;
        node.parent = parent;
        node.start  = start;
        node.path   = parent.path.slice();

        node.path.push(parent.childNodes.length);

        return node;
    }

    /**
     * @param   {Node}      node
     * @param   {number}    end
     * @param   {string}    [text='']
     * @return  {void}
     */

    static closeNode(node, end, text='') {
        node.end = end;

        if (node.isText) {
            node.text = text.slice(node.start, node.end);
        }
    }
}

export default TreeBuilder;