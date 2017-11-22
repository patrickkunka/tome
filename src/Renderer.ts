import MarkupTag from './constants/MarkupTag';
import TomeNode  from './models/TomeNode';

class Renderer {
    public static renderNodes(nodes: TomeNode[], parent: TomeNode = null): string {
        return nodes.map(node => Renderer.renderNode(node, parent)).join('');
    }

    private static renderNode(node: TomeNode, parent: TomeNode): string {
        let html: string = '';

        if (node.tag !== MarkupTag.TEXT) {
            html += '<' + node.tag + '>';
        }

        if (node.childNodes.length) {
            html += Renderer.renderNodes(node.childNodes, node);
        } else {
            // At #text leaf node

            const text = node.text
            // Replace 2 consecutive spaces with visible pattern of alternating
            // space/non-breaking space

            .replace(/ {2}/g, ' &nbsp;')

            // Replace leading space or single space with non-breaking space

            .replace(/^ ((?=\S)|$)/g, '&nbsp;');

            html += text.length ? text : '&#8203;';
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