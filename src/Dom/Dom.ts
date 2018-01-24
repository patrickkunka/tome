import Util from '../Util/Util';

class Dom {
    public root: HTMLElement = null;

    public getPathFromDomNode(domNode: Node): number[] {
        const path = [];

        while (domNode) {
            if (domNode instanceof HTMLElement && domNode === this.root) break;

            path.unshift(Util.index(domNode, true));

            domNode = domNode.parentElement;
        }

        return path;
    }
}

export default Dom;