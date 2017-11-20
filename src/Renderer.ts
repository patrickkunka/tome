import MarkupTag from './constants/MarkupTag';
import TomeNode  from './models/TomeNode';

class Renderer {
    static renderNodes(nodes: Array<TomeNode>, parent: TomeNode=null): string {
        return nodes.map(node => Renderer.renderNode(node, parent)).join('');
    }

    private static renderNode(node: TomeNode, parent: TomeNode): string {
        let html: string='';

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