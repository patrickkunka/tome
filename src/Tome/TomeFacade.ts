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

    // TODO: implement:

    public cut: () => string;
    public copy: () => string;
    public paste: () => void;

    constructor(el: HTMLElement, config: any) {
        const _ = new Tome(el, config);

        this.getState           = _.getState.bind(_);
        this.setValue           = _.setValue.bind(_);
        this.getValue           = _.getValue.bind(_);
        this.redo               = _.redo.bind(_);
        this.undo               = _.undo.bind(_);
        this.changeBlockType    = _.changeBlockType.bind(_);
        this.toggleInlineMarkup = _.toggleInlineMarkup.bind(_);

        Object.seal(this);
    }
}

export default TomeFacade;