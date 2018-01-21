import merge from 'helpful-merge';

import ConfigRoot         from '../Config/ConfigRoot';
import Dom                from '../Dom/Dom';
import EventManager       from '../Dom/EventManager';
import HtmlDiffPatch      from '../Dom/HtmlDiffPatch';
import ActionType         from '../State/Constants/ActionType';
import MarkupTag          from '../State/Constants/MarkupTag';
import MarkupType         from '../State/Constants/MarkupType';
import SelectionDirection from '../State/Constants/SelectionDirection';
import ISelection         from '../State/Interfaces/ISelection';
import IValue             from '../State/Interfaces/IValue';
import State              from '../State/State';
import StateManager       from '../State/StateManager';
import Renderer           from '../Tree/Renderer';
import TomeNode           from '../Tree/TomeNode';
import TreeBuilder        from '../Tree/TreeBuilder';
import Util               from '../Util/Util';
import INodeLike          from './Interfaces/INodeLike';
import ITome              from './Interfaces/ITome';

class Tome implements ITome {
    public dom:          Dom          = new Dom();
    public config:       ConfigRoot   = new ConfigRoot();
    public root:         TomeNode     = null;
    public stateManager: StateManager = new StateManager(this);

    private eventManager: EventManager = new EventManager(this);
    private lastRender:   string       = '';

    constructor(el: HTMLElement, config: any) {
        this.init(el, config);
    }

    public undo(): void {
        this.stateManager.undo();
    }

    public redo(): void {
        this.stateManager.redo();
    }

    public getState(): State {
        return this.stateManager.state;
    }

    public setValue(value: IValue): void {
        this.stateManager.applyAction({
            type: ActionType.REPLACE_VALUE,
            data: value
        });
    }

    public getValue(): IValue {
        const {state} = this.stateManager;

        return {
            text: state.text,
            markups: state.markups.map(Util.mapMarkupToArray)
        };
    }

    public toggleInlineMarkup(tag: MarkupTag) {
        if (Util.getMarkupType(tag) !== MarkupType.INLINE) {
            throw new TypeError(`[Tome] Markup tag "${tag}" is not a valid inline markup`);
        }

        const isLinkActive = this.stateManager.state.isTagActive(MarkupTag.A);

        if (!isLinkActive) {
            Util.addInlineLink(this);

            return;
        }

        this.stateManager.applyAction({type: ActionType.TOGGLE_INLINE, tag});
    }

    public changeBlockType(tag: MarkupTag) {
        if (Util.getMarkupType(tag) !== MarkupType.BLOCK) {
            throw new TypeError(`[Tome] Markup tag "${tag}" is not a valid block markup`);
        }

        this.stateManager.applyAction({type: ActionType.CHANGE_BLOCK_TYPE, tag});
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

    public render(shouldUpdateDom: boolean = false): void {
        // const prevRoot = this.root;

        const nextRoot = Tome.buildModelFromState(this.stateManager.state);

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

        this.stateManager.init(this.config.value);

        this.render(true);

        this.eventManager.root = this.dom.root;

        this.eventManager.bindEvents();
    }

    private static buildModelFromState(state: State): TomeNode {
        const root = new TomeNode();

        TreeBuilder.build(root, state.text, state.markups);

        return root;
    }
}

export default Tome;