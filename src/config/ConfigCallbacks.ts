import ActionType from '../constants/ActionType';
import State      from '../models/State';

class ConfigCallbacks {
    public onStateChange: (state: State, actionType: ActionType) => void = null;
    public onValueChange: () => void = null;

    constructor() {
        Object.seal(this);
    }
}

export default ConfigCallbacks;