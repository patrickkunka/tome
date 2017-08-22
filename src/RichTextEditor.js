import Dom          from './Dom';
import Util         from './Util';
import Markup       from './models/Markup';
import Node         from './models/Node';
import Caret        from './models/Caret';
import Range        from './models/Range';
import State        from './models/State';
import Action       from './models/Action';
import ConfigRoot   from './config/ConfigRoot';
import EventHandler from './EventHandler';
import TreeBuilder  from './TreeBuilder';
import Renderer     from './Renderer';
import reducer      from './actions/reducer';

import {
    SET_SELECTION,
    UNDO,
    REDO
} from './constants/Actions';

import {
    DIRECTION_LTR,
    DIRECTION_RTL
} from './constants/Common';

class RichTextEditor {
    constructor(el, config) {
        this.dom            = new Dom();
        this.eventHandler   = new EventHandler();
        this.config         = new ConfigRoot();
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

        this.init(el, config);
    }

    init(el, config) {
        Util.extend(this.config, config, true);

        if (!el.contentEditable) {
            el.contentEditable = true;
        }

        this.dom.root = el;

        this.history.push(this.buildInitialState(this.config.value));

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

        // TODO: if text but no markups, wrap entire in <p>

        state.markups = state.markups.map(markup => new Markup(markup));

        return state;
    }

    render() {
        this.root = RichTextEditor.buildModelFromState(this.state);

        this.dom.root.innerHTML = Renderer.renderNodes(this.root.childNodes);
    }

    undo() {
        if (this.historyIndex === 1) return;

        const fn = this.config.callbacks.onStateChange;

        this.historyIndex--;

        this.render();

        this.positionCaret(this.state.selection);

        if (typeof fn === 'function') {
            fn(this.state, UNDO);
        }
    }

    redo() {
        if (this.history.length - 1 === this.historyIndex) return;

        const fn = this.config.callbacks.onStateChange;

        this.historyIndex++;

        this.render();

        this.positionCaret(this.state.selection);

        if (typeof fn === 'function') {
            fn(this.state, REDO);
        }
    }

    /**
     * @param {object} actionRaw
     * @param {string} content
     * @return {void}
     */

    applyAction(actionRaw) {
        const action = Object.assign(new Action(), actionRaw);
        const fn = this.config.callbacks.onStateChange;

        if (action.type === SET_SELECTION) {
            // Detect new selection from browser API

            const selection = window.getSelection();

            if (!selection.anchorNode || !this.dom.root.contains(selection.anchorNode)) return;

            action.range = this.getRangeFromSelection(selection);
        } else {
            // Use previous range

            action.range = this.state.selection;
        }

        const nextState = [action].reduce(reducer, this.state);

        if (!(nextState instanceof State)) {
            throw new TypeError(`[RichTextEditor] Action type "${action.type.toString()}" did not return a valid state object`);
        }

        if (nextState === this.state) return;

        Object.freeze(nextState);
        Object.freeze(nextState.markups);
        Object.freeze(nextState.activeInlineMarkups);
        Object.freeze(nextState.envelopedBlockMarkups);

        // TODO: discern between 'push' vs 'replace' commands i.e. inserting a
        // char vs moving a cursor

        // Chop off any divergent future state

        this.history.length = this.historyIndex + 1;

        // Push in new state

        this.history.push(nextState);

        this.historyIndex++;

        if (action.type !== SET_SELECTION) {
            this.render();

            this.positionCaret(this.state.selection);
        }

        if (typeof fn === 'function') {
            fn(this.state, action.type);
        }
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

        // If the anchor is greater than the extent, or both paths are equal
        // but the anchor offset is greater than the extent offset, the range
        // should be considered "RTL"

        isRtl =
            Util.isGreaterPath(anchorPath, extentPath) ||
            (!Util.isGreaterPath(extentPath, anchorPath) && selection.anchorOffset > selection.extentOffset);

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

        TreeBuilder.build(root, state.text, state.markups);

        return root;
    }
}

export default RichTextEditor;