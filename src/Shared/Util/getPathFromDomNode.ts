import getIndex from './getIndex';

function getPathFromDomNode(domNode: Node, root: Node): number[] {
    const path = [];

    while (domNode) {
        if (domNode instanceof HTMLElement && domNode === root) break;

        path.unshift(getIndex(domNode, true));

        domNode = domNode.parentElement;
    }

    return path;
}

export default getPathFromDomNode;