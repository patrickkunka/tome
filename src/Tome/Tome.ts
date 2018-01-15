import merge from 'helpful-merge';

import ConfigRoot         from '../Config/ConfigRoot';
import Dom                from '../Dom/Dom';
import EventManager       from '../Dom/EventManager';
import HtmlDiffPatch      from '../Dom/HtmlDiffPatch';
import Action             from '../State/Action';
import ActionType         from '../State/Constants/ActionType';
import MarkupTag          from '../State/Constants/MarkupTag';
import MarkupType         from '../State/Constants/MarkupType';
import SelectionDirection from '../State/Constants/SelectionDirection';
import IAction            from '../State/Interfaces/IAction';
import ISelection         from '../State/Interfaces/ISelection';
import IValue             from '../State/Interfaces/IValue';
import reducer            from '../State/reducer';
import State              from '../State/State';
import TomeSelection      from '../State/TomeSelection';
import Caret              from '../Tree/Caret';
import Renderer           from '../Tree/Renderer';
import TomeNode           from '../Tree/TomeNode';
import TreeBuilder        from '../Tree/TreeBuilder';
import Util               from '../Util/Util';
import INodeLike          from './Interfaces/INodeLike';
import ITome              from './Interfaces/ITome';

class Tome implements ITome {
    public dom:    Dom          = new Dom();
    public config: ConfigRoot   = new ConfigRoot();
    public root:   TomeNode     = null;

    private eventManager: EventManager = new EventManager(this);
    private history:      State[]      = [];
    private historyIndex: number       = -1;
    private lastRender:   string       = '';

    constructor(el: HTMLElement, config: any) {
        this.init(el, config);
    }

    private get state(): State {
        return this.history[this.historyIndex];
    }

    public undo(): void {
        if (this.historyIndex === 1) return;

        const fn = this.config.callbacks.onStateChange;

        this.historyIndex--;

        this.render(true);

        this.positionCaret(this.state.selection);

        if (typeof fn === 'function') {
            fn(this.state, ActionType.UNDO);
        }
    }

    public redo(): void {
        if (this.history.length - 1 === this.historyIndex) return;

        const fn = this.config.callbacks.onStateChange;

        this.historyIndex++;

        this.render(true);

        this.positionCaret(this.state.selection);

        if (typeof fn === 'function') {
            fn(this.state, ActionType.REDO);
        }
    }

    public getState(): State {
        return this.state;
    }

    public setValue(value: IValue): void {
        this.applyAction({
            type: ActionType.REPLACE_VALUE,
            data: value
        });
    }

    public getValue(): IValue {
        return {
            text: this.state.text,
            markups: this.state.markups.map(Util.mapMarkupToArray)
        };
    }

    public toggleInlineMarkup(tag: MarkupTag) {
        if (Util.getMarkupType(tag) !== MarkupType.INLINE) {
            throw new TypeError(`[Tome] Markup tag "${tag}" is not a valid inline markup`);
        }

        const isLinkActive = this.state.isTagActive(MarkupTag.A);

        if (!isLinkActive) {
            Util.addInlineLink(this);

            return;
        }

        this.applyAction({type: ActionType.TOGGLE_INLINE, tag});
    }

    public changeBlockType(tag: MarkupTag) {
        if (Util.getMarkupType(tag) !== MarkupType.BLOCK) {
            throw new TypeError(`[Tome] Markup tag "${tag}" is not a valid block markup`);
        }

        this.applyAction({type: ActionType.CHANGE_BLOCK_TYPE, tag});
    }

    public applyAction(actionRaw: IAction): void {
        const action: Action = Object.assign(new Action(), actionRaw);
        const fn = this.config.callbacks.onStateChange;

        if (action.type === ActionType.SET_SELECTION) {
            // Detect new selection from browser API

            const selection = window.getSelection();

            if (!selection.anchorNode || !this.dom.root.contains(selection.anchorNode)) return;

            action.range = this.getRangeFromSelection(selection);

            if (action.range.from === this.state.selection.from && action.range.to === this.state.selection.to) return;
        } else if (action.range) {
            // A range has been set, coerce to type

            action.range = Object.assign(new TomeSelection(), action.range);
        } else {
            // Use previous range

            action.range = this.state.selection;
        }

        const nextState = reducer(this.state, action);

        if (!(nextState instanceof State)) {
            throw new TypeError(`[Tome] Action type "${action.type.toString()}" did not return a valid state object`);
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

        if (action.type !== ActionType.SET_SELECTION && action.type !== ActionType.MUTATE) {
            this.render(true);

            this.positionCaret(this.state.selection);
        } else if (action.type === ActionType.MUTATE) {
            // Update internal tree only, but do not render.

            this.render();
        }

        if (typeof fn === 'function') {
            fn(this.state, action.type);
        }
    }

    public getPathFromDomNode(domNode: Node): number[] {
        const path = [];

        while (domNode) {
            if (domNode instanceof HTMLElement && domNode === this.dom.root) break;

            path.unshift(Util.index(domNode, true));

            domNode = domNode.parentElement;
        }

        return path;
    }

    public getNodeByPath<T extends INodeLike>(path: number[], root: T): T {
        let node: T = root;
        let index = -1;
        let i = 0;

        while (typeof (index = path[i]) === 'number') {
            node = node.childNodes[index];

            i++;
        }

        return node || null;
    }

    private init(el: HTMLElement, config: any): void {
        merge(this.config, config, {
            deep: true,
            errorMessage: (offender, suggestion = '') => {
                return (
                    `[Tome] Invalid configuration option "${offender}"` +
                    (suggestion ? `. Did you mean "${suggestion}"?` : '')
                );
            }
        });

        if (!el.contentEditable) {
            el.contentEditable = true.toString();
        }

        this.dom.root = el;

        this.history.push(new State(this.config.value));

        this.historyIndex++;

        this.render(true);

        this.eventManager.root = this.dom.root;

        this.eventManager.bindEvents();
    }

    private render(shouldUpdateDom: boolean = false): void {
        // const prevRoot = this.root;

        const nextRoot = Tome.buildModelFromState(this.state);

        // const treeDiffCommand = TreeDiffPatch.diff(prevRoot, nextRoot);

        this.root = nextRoot;

        const nextRender = Renderer.renderNodes(this.root.childNodes);

        if (!this.lastRender) {
            // Initial render

            this.dom.root.innerHTML = this.lastRender = nextRender;

            return;
        }

        const prevRender = this.lastRender;

        const diffCommand = HtmlDiffPatch.diff(`<div>${prevRender}</div>`, `<div>${nextRender}</div>`);

        if (shouldUpdateDom) {
            HtmlDiffPatch.patch(this.dom.root, diffCommand);
        }

        this.lastRender = nextRender;
    }

    private getRangeFromSelection(selection: Selection): TomeSelection {
        const anchorPath = this.getPathFromDomNode(selection.anchorNode);
        const from = new Caret();
        const to = new Caret();

        let virtualAnchorNode = this.getNodeByPath(anchorPath, this.root);
        let anchorOffset = selection.anchorOffset;
        let extentOffset = selection.extentOffset;

        if (virtualAnchorNode.isBlock && anchorOffset > 0) {
            // Caret is lodged between a safety <br> and
            // the end of block

            virtualAnchorNode = virtualAnchorNode.childNodes[anchorOffset];
            anchorOffset = virtualAnchorNode.text.length;
        }

        let extentPath = anchorPath;
        let virtualExtentNode: TomeNode = virtualAnchorNode;
        let isRtl = false;
        let rangeFrom = -1;
        let rangeTo = -1;

        if (!selection.isCollapsed) {
            extentPath = this.getPathFromDomNode(selection.extentNode);
            virtualExtentNode = this.getNodeByPath(extentPath, this.root);

            if (virtualExtentNode.isBlock && extentOffset > 0) {
                virtualExtentNode = virtualExtentNode.childNodes[extentOffset];

                extentOffset = virtualExtentNode.text.length;
            }
        }

        // If the anchor is greater than the extent, or both paths are equal
        // but the anchor offset is greater than the extent offset, the range
        // should be considered "RTL"

        isRtl =
            Util.isGreaterPath(anchorPath, extentPath) ||
            (!Util.isGreaterPath(extentPath, anchorPath) && selection.anchorOffset > selection.extentOffset);

        from.node   = to.node = isRtl ? virtualExtentNode : virtualAnchorNode;
        from.offset = to.offset = isRtl ? extentOffset : anchorOffset;
        from.path   = to.path = isRtl ? extentPath : anchorPath;

        if (!selection.isCollapsed) {
            to.node     = isRtl ? virtualAnchorNode : virtualExtentNode;
            to.offset   = isRtl ? anchorOffset : extentOffset;
            to.path     = isRtl ? anchorPath : extentPath;
        }

        rangeFrom = Math.min(from.node.start + from.offset, from.node.end);
        rangeTo = Math.min(to.node.start + to.offset, to.node.end);

        return new TomeSelection(rangeFrom, rangeTo, isRtl ? SelectionDirection.RTL : SelectionDirection.LTR);
    }

    private positionCaret({from, to, direction}: ISelection): void {
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

        nodeLeft = this.getNodeByPath(virtualNode.path, this.dom.root);

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

        nodeRight = this.getNodeByPath(virtualNode.path, this.dom.root);

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

    private static buildModelFromState(state: State): TomeNode {
        const root = new TomeNode();

        TreeBuilder.build(root, state.text, state.markups);

        return root;
    }
}

export default Tome;