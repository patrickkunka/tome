import IAction from './interfaces/IAction';
import IValue  from './interfaces/IValue';
import State   from './models/State';
import Tome    from './Tome';

class TomeFacade {
    public applyAction: (action: IAction) => void;
    public getState: () => State;
    public setValue: (state: IValue) => void;
    public redo: () => void;
    public undo: () => void;

    constructor(el: HTMLElement, config: any) {
        const _ = new Tome(el, config);

        this.applyAction = _.applyAction.bind(_);
        this.getState = _.getState.bind(_);
        this.setValue = _.getState.bind(_);
        this.redo = _.applyAction.bind(_);
        this.undo = _.applyAction.bind(_);

        Object.seal(this);
    }
}

export default TomeFacade;