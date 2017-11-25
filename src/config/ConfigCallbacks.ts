import ActionType  from '../constants/ActionType';
import IAnchorData from '../interfaces/IAnchorData';
import State       from '../models/State';

class ConfigCallbacks {
    public onStateChange:  (state: State, actionType: ActionType) => void = null;
    public onAddAnchor:    (handlerCreate: (anchorData: IAnchorData) => void) => void = null;
    public onValueChange:  () => void = null;

    constructor() {
        Object.seal(this);
    }
}

export default ConfigCallbacks;