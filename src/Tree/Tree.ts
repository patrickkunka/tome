import HtmlDiffPatch      from '../Dom/HtmlDiffPatch';
import SelectionDirection from '../State/Constants/SelectionDirection';
import ISelection         from '../State/interfaces/ISelection';
import State              from '../State/State';
import Tome               from '../Tome/Tome';
import Util               from '../Util/Util';
import Renderer           from './Renderer';
import TomeNode           from './TomeNode';
import TreeBuilder        from './TreeBuilder';
import TreeDiffPatch      from './TreeDiffPatch';

class Tree {
    public root: TomeNode = null;

    private tome: Tome = null;
    private lastRender: string = '';

    constructor(tome) {
        this.tome = tome;
    }

    public render(shouldUpdateDom: boolean = false): void {
        const nextRoot = Tree.buildFromState(this.tome.stateManager.state);
        const treeDiffCommand = TreeDiffPatch.diff(this.root, nextRoot);

        console.log(treeDiffCommand);

        this.root = nextRoot;

        const nextRender = Renderer.renderNodes(this.root.childNodes);

        if (!this.lastRender) {
            // Initial render

            this.tome.dom.root.innerHTML = this.lastRender = nextRender;

            return;
        }

        const prevRender = this.lastRender;

        const diffCommand = HtmlDiffPatch.diff(`<div>${prevRender}</div>`, `<div>${nextRender}</div>`);

        if (shouldUpdateDom) {
            HtmlDiffPatch.patch(this.tome.dom.root, diffCommand);
        }

        this.lastRender = nextRender;
    }

    public positionCaret({from, to, direction}: ISelection): void {
        const range = document.createRange();
        const selection = window.getSelection();

        let childNodes:  TomeNode[] = this.root.childNodes;
        let virtualNode: TomeNode;
        let nodeLeft:    Node;
        let nodeRight:   Node;
        let offsetStart: number;
        let offsetEnd:   number;

        for (let i = 0; (virtualNode = childNodes[i]); i++) {
            // Node ends before caret

            if (virtualNode.end < from) continue;

            // The desired node is this node, or within this node

            if (virtualNode.childNodes.length) {
                // Node has children, drop down until at leaf

                childNodes = virtualNode.childNodes;

                i = -1;

                continue;
            }

            // At leaf

            offsetStart = from - virtualNode.start;

            break;
        }

        nodeLeft = Util.getNodeByPath(virtualNode.path, this.tome.dom.root);

        // Account for #text nodes representing a block break, but with only 1 character rendered

        range.setStart(nodeLeft, Math.min(offsetStart, nodeLeft.textContent.length));

        if (from === to) {
            // Single caret

            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);

            return;
        }

        // Multi-character selection, reset child nodes

        childNodes = this.root.childNodes;

        for (let i = 0; (virtualNode = childNodes[i]); i++) {
            if (virtualNode.end < to) continue;

            if (virtualNode.childNodes.length) {
                childNodes = virtualNode.childNodes;

                i = -1;

                continue;
            }

            offsetEnd = to - virtualNode.start;

            break;
        }

        nodeRight = Util.getNodeByPath(virtualNode.path, this.tome.dom.root);

        range.setEnd(nodeRight, Math.min(offsetEnd, nodeRight.textContent.length));

        selection.removeAllRanges();

        if (direction === SelectionDirection.LTR) {
            selection.setBaseAndExtent(
                nodeRight,
                Math.min(offsetEnd, nodeRight.textContent.length),
                nodeLeft,
                Math.min(offsetStart, nodeLeft.textContent.length)
            );
        } else {
            selection.setBaseAndExtent(
                nodeLeft,
                Math.min(offsetStart, nodeLeft.textContent.length),
                nodeRight,
                Math.min(offsetEnd, nodeRight.textContent.length)
            );
        }
    }

    private static buildFromState(state: State): TomeNode {
        const root = new TomeNode();

        TreeBuilder.build(root, state.text, state.markups);

        return root;
    }
}

export default Tree;