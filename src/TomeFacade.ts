import MarkupTag  from './constants/MarkupTag';
import IAction    from './interfaces/IAction';
import IValue     from './interfaces/IValue';
import State      from './models/State';
import Tome       from './Tome';

class TomeFacade {
    public applyAction: (action: IAction) => void;
    public getState: () => State;
    public setValue: (state: IValue) => void;
    public redo: () => void;
    public undo: () => void;

    // TODO: implement:

    public cut: () => string;
    public copy: () => string;
    public paste: () => void;
    public toggleInlineMarkup: (markupTag: MarkupTag) => void;
    public changeBlockType: (markupTag: MarkupTag) => void;

    constructor(el: HTMLElement, config: any) {
        const _ = new Tome(el, config);

        this.applyAction = _.applyAction.bind(_);
        this.getState = _.getState.bind(_);
        this.setValue = _.setValue.bind(_);
        this.redo = _.applyAction.bind(_);
        this.undo = _.applyAction.bind(_);

        Object.seal(this);
    }
}

export default TomeFacade;