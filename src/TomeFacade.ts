import IAction from './interfaces/IAction';
import Tome    from './Tome';

class TomeFacade {
    public applyAction: (action: IAction) => void;
    public redo: () => void;
    public undo: () => void;

    constructor(el: HTMLElement, config: any) {
        const _ = new Tome(el, config);

        this.applyAction = _.applyAction.bind(_);
        this.redo = _.applyAction.bind(_);
        this.undo = _.applyAction.bind(_);

        Object.seal(this);
    }
}

export default TomeFacade;