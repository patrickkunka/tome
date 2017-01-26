class Renderer {
    static renderNodes(nodes, parent=null) {
        return nodes.map(node => Renderer.renderNode(node, parent)).join('');
    }

    static renderNode(node, parent) {
        let html = '';

        if (node.tag) {
            html += '<' + node.tag + '>';
        }

        if (node.childNodes.length) {
            html += Renderer.renderNodes(node.childNodes, node);
        } else if (parent) {
            // Text leaf node

            html += node.text;
        } else {
            // Top-level text node between two blocks, interpret as new line

            html += '\n';
        }

        if (parent && parent.childNodes[parent.childNodes.length - 1] === node && html.match(/ $/)) {
            html += '&#8203;';
        }

        if (node.tag) {
            html += '</' + node.tag + '>';
        }

        return html;
    }
}

export default Renderer;