import IAnchorData from '../Dom/Interfaces/IAnchorData';
import ActionType  from '../State/Constants/ActionType';
import State       from '../State/State';

class ConfigCallbacks {
    public onStateChange:  (state: State, actionType: ActionType) => void = null;
    public onAddAnchor:    (handlerCreate: (anchorData: IAnchorData) => void) => void = null;
    public onValueChange:  () => void = null;

    constructor() {
        Object.seal(this);
    }
}

export default ConfigCallbacks;