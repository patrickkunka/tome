import MarkupTag  from '../State/Constants/MarkupTag';
import IValue     from '../State/Interfaces/IValue';
import State      from '../State/State';
import Tome       from './Tome';

class TomeFacade {
    public getState:           () => State;
    public setValue:           (state: IValue) => void;
    public getValue:           () => IValue;
    public redo:               () => void;
    public undo:               () => void;
    public changeBlockType:    (markupTag: MarkupTag) => void;
    public toggleInlineMarkup: (markupTag: MarkupTag) => void;
    public editAnchor:         () => void;
    public insertCustomBlock:  (type: string, data: any) => void;
    public updateCustomBlock:  (container: HTMLElement, data: any) => void;
    public removeCustomBlock:  (container: HTMLElement) => void;
    public moveCustomBlock:    (container: HTMLElement, offset: number) => void;

    constructor(el: HTMLElement, config: any) {
        const _ = new Tome(el, config);

        this.getState           = _.getState.bind(_);
        this.setValue           = _.setValue.bind(_);
        this.getValue           = _.getValue.bind(_);
        this.redo               = _.redo.bind(_);
        this.undo               = _.undo.bind(_);
        this.changeBlockType    = _.changeBlockType.bind(_);
        this.toggleInlineMarkup = _.toggleInlineMarkup.bind(_);
        this.editAnchor         = _.editAnchor.bind(_);
        this.insertCustomBlock  = _.insertCustomBlock.bind(_);
        this.updateCustomBlock  = _.updateCustomBlock.bind(_);
        this.removeCustomBlock  = _.removeCustomBlock.bind(_);
        this.moveCustomBlock    = _.moveCustomBlock.bind(_);

        Object.seal(this);
    }
}

export default TomeFacade;