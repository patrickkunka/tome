import merge from 'helpful-merge';

import Config             from '../Config/Root';
import Dom                from '../Dom/Dom';
import EventManager       from '../Dom/EventManager';
import ActionType         from '../State/Constants/ActionType';
import MarkupTag          from '../State/Constants/MarkupTag';
import MarkupType         from '../State/Constants/MarkupType';
import ICustomBlock       from '../State/Interfaces/ICustomBlock';
import IValue             from '../State/Interfaces/IValue';
import State              from '../State/State';
import StateManager       from '../State/StateManager';
import Tree               from '../Tree/Tree';
import Util               from '../Util/Util';
import ITome              from './Interfaces/ITome';

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

    public insertCustomBlock(type: string, data = {}) {
        if (!type || typeof type !== 'string') {
            throw new TypeError(`[Tome] A valid custom block type must be provided`);
        }

        if (typeof this.config.customBlocks[type] !== 'function') {
            throw new TypeError(`[Tome] No custom block registered of type "${type}"`);
        }

        const customBlock: ICustomBlock = {
            type,
            data
        };

        this.stateManager.applyAction({type: ActionType.INSERT_CUSTOM_BLOCK, data: customBlock});
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
}

export default Tome;