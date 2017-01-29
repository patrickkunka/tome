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

        let isAtLeaf = false;
        let node = root;

        node.start = 0;
        node.end = text.length;

        for (let i = 0; i <= text.length; i++) {
            let requiresNewLeaf = false;

            for (let j = 0, markup; (markup = markups[j]); j++) {
                let closedNode = null;

                if (markup[2] !== i || markup[1] === markup[2]) continue;

                if (isAtLeaf && openNodes[openNodes.length - 1].isText) {
                    const textNode = openNodes.pop();

                    TreeBuilder.closeNode(textNode, i, text);

                    isAtLeaf = false;
                }

                requiresNewLeaf = true;

                closedNode = openNodes.pop();

                TreeBuilder.closeNode(closedNode, i);

                node = closedNode.parent;
            }

            for (let j = 0, markup; (markup = markups[j]); j++) {
                let newNode = null;

                if (markup[1] !== i) continue;

                if (isAtLeaf) {
                    const textNode = openNodes.pop();

                    TreeBuilder.closeNode(textNode, i, text);

                    isAtLeaf = false;
                }

                newNode = TreeBuilder.getOpenNode(markup[0], i, node);

                openNodes.push(newNode);

                node.childNodes.push(newNode);

                node = newNode;

                requiresNewLeaf = true;

                if (markup[1] === markup[2]) {
                    // Empty tag, close immediately

                    TreeBuilder.closeNode(node, i);
                }
            }

            if (requiresNewLeaf) {
                const leaf = TreeBuilder.getOpenNode('', i, node);

                if (node.start === node.end) {
                    // Empty leaf in empty node, close immediately

                    node.childNodes.push(leaf);

                    TreeBuilder.closeNode(leaf, i);

                    node = node.parent;

                    openNodes.pop();
                } else if (i < text.length) {
                    // Should open leaf node, but not at end of string

                    node.childNodes.push(leaf);

                    openNodes.push(leaf);

                    isAtLeaf = true;
                }

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