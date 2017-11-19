import MarkupTag from './constants/MarkupTag';

class Renderer {
    static renderNodes(nodes, parent=null) {
        return nodes.map(node => Renderer.renderNode(node, parent)).join('');
    }

    static renderNode(node, parent) {
        let html = '';

        if (node.tag !== MarkupTag.TEXT) {
            html += '<' + node.tag + '>';
        }

        if (node.childNodes.length) {
            html += Renderer.renderNodes(node.childNodes, node);
        } else {
            // Text leaf node

            html += node.text.length ? node.text : '&#8203;';
        }

        if (parent && parent.childNodes[parent.childNodes.length - 1] === node && html.match(/ $/)) {
            html += '&#8203;';
        }

        if (node.tag !== MarkupTag.TEXT) {
            html += '</' + node.tag + '>';
        }

        return html;
    }
}

export default Renderer;