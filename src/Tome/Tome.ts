import merge from 'helpful-merge';

import Config         from '../Config/Root';
import Dom            from '../Dom/Dom';
import EventManager   from '../Dom/EventManager';
import ActionType     from '../State/Constants/ActionType';
import MarkupTag      from '../State/Constants/MarkupTag';
import MarkupType     from '../State/Constants/MarkupType';
import ICustomBlock   from '../State/Interfaces/ICustomBlock';
import IMarkupLocator from '../State/Interfaces/IMarkupLocator';
import IValue         from '../State/Interfaces/IValue';
import State          from '../State/State';
import StateManager   from '../State/StateManager';
import Tree           from '../Tree/Tree';
import Util           from '../Util/Util';
import ITome          from './Interfaces/ITome';

class Tome implements ITome {
    public dom:          Dom          = new Dom();
    public config:       Config       = new Config();
    public tree:         Tree         = new Tree(this);
    public stateManager: StateManager = new StateManager(this);
    public eventManager: EventManager = new EventManager(this);

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

        if (tag === MarkupTag.A) {
            const isLinkActive = this.stateManager.state.isTagActive(MarkupTag.A);

            if (!isLinkActive) {
                Util.addInlineLink(this);

                return;
            }
        }

        this.stateManager.applyAction({type: ActionType.TOGGLE_INLINE, tag});
    }

    public changeBlockType(tag: MarkupTag) {
        if (Util.getMarkupType(tag) !== MarkupType.BLOCK) {
            throw new TypeError(`[Tome] Markup tag "${tag}" is not a valid block markup`);
        }

        this.stateManager.applyAction({type: ActionType.CHANGE_BLOCK_TYPE, tag});
    }

    public insertCustomBlock(type: string, data = {}) {
        if (!type || typeof type !== 'string') {
            throw new TypeError('[Tome] A valid custom block type must be provided');
        }

        const customBlock: ICustomBlock = {
            type,
            data
        };

        this.stateManager.applyAction({type: ActionType.INSERT_CUSTOM_BLOCK, data: customBlock});
    }

    public updateCustomBlock(container: HTMLElement, data = {}): void {
        const {markup} = this.getMarkupFromDomNode(container);

        markup[3] = data;
    }

    public removeCustomBlock(container: HTMLElement): void {
        const markup = this.getMarkupFromDomNode(container).markup;

        this.stateManager.applyAction({type: ActionType.REMOVE_CUSTOM_BLOCK, data: {markup}});
    }

    public moveCustomBlock(container: HTMLElement, offset: number): void {
        const {markup, index} = this.getMarkupFromDomNode(container);

        this.stateManager.applyAction({type: ActionType.MOVE_CUSTOM_BLOCK, data: {
            markup,
            index,
            offset
        }});
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

        this.tree.render(true);

        this.eventManager.root = this.dom.root;

        this.eventManager.bindEvents();
    }

    private getMarkupFromDomNode(container: HTMLElement): IMarkupLocator {
        const path = this.dom.getPathFromDomNode(container);
        const node = Util.getNodeByPath(path, this.tree.root);

        if (!node) throw new Error('[Tome] No custom block found for provided container');

        const {index} = node;
        const markup = this.stateManager.state.markups[index];

        if (!markup.isCustomBlock) throw new TypeError('[Tome] The provided element is not a custom block container');

        return {
            markup,
            index
        };
    }
}

export default Tome;