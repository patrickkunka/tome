import IAnchorData from '../Dom/Interfaces/IAnchorData';
import ActionType  from '../State/Constants/ActionType';
import State       from '../State/State';

class Callbacks {
    public onStateChange:       (state: State, actionType: ActionType) => void = null;
    public onAddAnchor:         (handlerCreate: (anchorData: IAnchorData) => void) => void = null;
    public onValueChange:       () => void = null;
    public onAddCustomBlock:    (container: HTMLElement, type: string, data: any) => void;
    public onRemoveCustomBlock: (container: HTMLElement) => void;

    constructor() {
        Object.seal(this);
    }
}

export default Callbacks;