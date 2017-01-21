class Renderer {
    static renderNodes(nodes) {
        return nodes.map(Renderer.renderNode).join('');
    }

    static renderNode(node) {
        let html = '';

        if (node.tag) {
            html += '<' + node.tag + '>';
        }

        if (node.childNodes.length) {
            html += Renderer.renderNodes(node.childNodes);
        } else {
            html += node.text;
        }

        if (node.tag) {
            html += '</' + node.tag + '>';
        }

        return html;
    }
}

export default Renderer;