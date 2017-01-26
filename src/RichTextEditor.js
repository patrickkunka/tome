import Dom          from './Dom';
import Util         from './Util';
import Markup       from './models/Markup';
import Node         from './models/Node';
import Caret        from './models/Caret';
import Range        from './models/Range';
import State        from './models/State';
import EventHandler from './EventHandler';
import Editor       from './Editor';
import TreeBuilder  from './TreeBuilder';
import Renderer     from './Renderer';

class RichTextEditor {
    constructor() {
        this.dom            = new Dom();
        this.state          = new State();
        this.eventHandler   = new EventHandler();
        this.root           = null;
        this.history        = [];
    }

    attach(el, initialState) {
        this.dom.root = el;

        Util.extend(this.state, initialState);

        this.state.markups = this.state.markups.map(markup => new Markup(markup));

        this.root = RichTextEditor.buildModelFromState(this.state);

        console.log(this.root);

        this.render();

        this.eventHandler.bindEvents(this.dom.root, this);
    }

    render() {
        this.dom.root.innerHTML = Renderer.renderNodes(this.root.childNodes);
    }

    performCommand(command, content) {
        const selection = window.getSelection();
        const range = this.getRangeFromSelection(selection);

        const fn = Editor[command];

        if (typeof fn !== 'function') {
            throw new Error(`[RichTextEditor] No editor method for command "${command}"`);
        }

        const newState = fn(this.state, range, content);

        if (newState === this.state) return;

        this.history.push(this.state);

        this.state = newState;

        this.root = RichTextEditor.buildModelFromState(this.state);

        this.render();

        this.positionCaret(this.state.selection);
    }

    getPathFromNode(node) {
        const path = [];

        while (node && node !== this.dom.root) {
            path.unshift(Util.index(node, true));

            node = node.parentElement;
        }

        return path;
    }

    getNodeByPath(path, root) {
        let node = root;
        let index = -1;
        let i = 0;

        while (typeof (index = path[i]) === 'number') {
            node = node.childNodes[index];

            i++;
        }

        return node || null;
    }

    /**
     * @param   {Selection} selection
     * @return  {Range}
     */

    getRangeFromSelection(selection) {
        const anchorPath = this.getPathFromNode(selection.anchorNode);
        const virtualAnchorNode = this.getNodeByPath(anchorPath, this.root);
        const from = new Caret();
        const to = new Caret();

        let extentPath = anchorPath;
        let virtualExtentNode = virtualAnchorNode;
        let isRtl = false;

        if (!selection.isCollapsed) {
            extentPath = this.getPathFromNode(selection.extentNode);
            virtualExtentNode = this.getNodeByPath(extentPath, this.root);
        }

        isRtl = extentPath < anchorPath || !(extentPath > anchorPath) && selection.anchorOffset > selection.extentOffset;

        from.node   = to.node = isRtl ? virtualExtentNode : virtualAnchorNode;
        from.offset = to.offset = isRtl ? selection.extentOffset : selection.anchorOffset;
        from.path   = to.path = isRtl ? extentPath : anchorPath;

        if (!selection.isCollapsed) {
            to.node     = isRtl ? virtualAnchorNode : virtualExtentNode;
            to.offset   = isRtl ? selection.anchorOffset : selection.extentOffset;
            to.path     = isRtl ? anchorPath : extentPath;
        }

        return new Range(from.node.start + from.offset, to.node.start + to.offset);
    }

    positionCaret([start, end]) {
        const range = document.createRange();
        const selection = window.getSelection();

        let childNodes  = this.root.childNodes;
        let virtualNode = null;
        let nodeLeft    = null;
        let nodeRight   = null;
        let offsetStart = -1;
        let offsetEnd   = -1;

        for (let i = 0; (virtualNode = childNodes[i]); i++) {
            if (virtualNode.end < start) continue;

            if (virtualNode.childNodes.length) {
                childNodes = virtualNode.childNodes;

                i = -1;

                continue;
            }

            offsetStart = start - virtualNode.start;

            break;
        }

        range.setStart(nodeLeft, offsetStart);

        if (start === end) {
            range.collapse(true);
        } else {
            nodeLeft = this.getNodeByPath(virtualNode.path, this.dom.root);

            for (let i = 0; (virtualNode = childNodes[i]); i++) {
                if (virtualNode.end < end) continue;

                if (virtualNode.childNodes.length) {
                    childNodes = virtualNode.childNodes;

                    i = -1;

                    continue;
                }

                offsetEnd = end - virtualNode.start;

                break;
            }

            range.setEnd(nodeRight, offsetEnd);
        }

        selection.removeAllRanges();
        selection.addRange(range);
    }

    static buildModelFromState(state) {
        const root = new Node();

        TreeBuilder.buildTreeFromRoot(root, state.text, state.markups);

        return root;
    }
}

export default RichTextEditor;