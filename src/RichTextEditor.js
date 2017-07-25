import Dom          from './Dom';
import Util         from './Util';
import Markup       from './models/Markup';
import Node         from './models/Node';
import Caret        from './models/Caret';
import Range        from './models/Range';
import State        from './models/State';
import Action       from './models/Action';
import EventHandler from './EventHandler';
// import Editor       from './Editor';
import TreeBuilder  from './TreeBuilder';
import Renderer     from './Renderer';
import reducer      from './actions/reducer';

import {
    SET_SELECTION
} from './constants/Actions';

import {
    DIRECTION_LTR,
    DIRECTION_RTL
} from './constants/Common';

class RichTextEditor {
    constructor() {
        this.dom            = new Dom();
        this.eventHandler   = new EventHandler();
        this.root           = null;
        this.history        = [];
        this.historyIndex   = -1;

        Object.defineProperties(this, {
            state: {
                get() {
                    return this.history[this.historyIndex];
                }
            }
        });
    }

    attach(el, initialState=new State()) {
        this.dom.root = el;

        this.history.push(this.buildInitialState(initialState));

        this.historyIndex++;

        this.render();

        this.eventHandler.bindEvents(this.dom.root, this);
    }

    /**
     * @param   {object} initialState
     * @return  {State}
     */

    buildInitialState(initialState) {
        const state = Util.extend(new State(), initialState);

        if (state.markups.length < 1) {
            state.markups.push(['p', 0, 0]);
        }

        state.markups = state.markups.map(markup => new Markup(markup));

        return state;
    }

    render() {
        this.root = RichTextEditor.buildModelFromState(this.state);

        this.dom.root.innerHTML = Renderer.renderNodes(this.root.childNodes);
    }

    undo() {
        if (this.historyIndex === 0) return;

        this.historyIndex--;

        this.render();

        this.positionCaret(this.state.selection);
    }

    redo() {
        if (this.history.length - 1 === this.historyIndex) return;

        this.historyIndex++;

        this.render();

        this.positionCaret(this.state.selection);
    }

    applyAction(type, content='') {
        const selection = window.getSelection();
        const range = this.getRangeFromSelection(selection);

        const nextState = [type].reduce((prevState, type) => {
            const action = new Action();

            action.type     = type;
            action.range    = range;
            action.content  = content;

            return reducer(prevState, action);
        }, this.state);

        if (!(nextState instanceof State)) {
            throw new TypeError(`[RichTextEditor] Action type "${type}" did not return a valid state object`);
        }

        if (nextState === this.state) return;

        // TODO: discern 'push' vs 'replace' commands i.e. inserting a
        // char vs moving a cursor

        console.log(type);

        this.history.push(nextState);

        this.historyIndex++;

        // Chop off any divergent future state

        this.history.length = this.historyIndex + 1;

        if (type === SET_SELECTION) return;

        console.log('render', this.state);

        this.render();

        this.positionCaret(this.state.selection);

        // console.log(JSON.stringify(this.state.markups));
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

    // TODO: consolodate range/selection models, no need for both

    getRangeFromSelection(selection) {
        const anchorPath = this.getPathFromNode(selection.anchorNode);
        const virtualAnchorNode = this.getNodeByPath(anchorPath, this.root);
        const from = new Caret();
        const to = new Caret();

        let extentPath = anchorPath;
        let virtualExtentNode = virtualAnchorNode;
        let isRtl = false;
        let rangeFrom = -1;
        let rangeTo = -1;

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

        rangeFrom = Math.min(from.node.start + from.offset, from.node.end);
        rangeTo = Math.min(to.node.start + to.offset, to.node.end);

        return new Range(rangeFrom, rangeTo, isRtl ? DIRECTION_RTL : DIRECTION_LTR);
    }

    positionCaret({from, to, isRtl}) {
        const range = document.createRange();
        const selection = window.getSelection();

        let childNodes  = this.root.childNodes;
        let virtualNode = null;
        let nodeLeft    = null;
        let nodeRight   = null;
        let offsetStart = -1;
        let offsetEnd   = -1;

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

        nodeLeft = this.getNodeByPath(virtualNode.path, this.dom.root);

        range.setStart(nodeLeft, offsetStart);

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

        nodeRight = this.getNodeByPath(virtualNode.path, this.dom.root);

        range.setEnd(nodeRight, offsetEnd);

        selection.removeAllRanges();

        if (isRtl) {
            selection.setBaseAndExtent(nodeRight, offsetEnd, nodeLeft, offsetStart);
        } else {
            selection.setBaseAndExtent(nodeLeft, offsetStart, nodeRight, offsetEnd);
        }
    }

    static buildModelFromState(state) {
        const root = new Node();

        TreeBuilder.buildTreeFromRoot(root, state.text, state.markups);

        return root;
    }
}

export default RichTextEditor;