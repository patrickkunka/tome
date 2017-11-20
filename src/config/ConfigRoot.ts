import ConfigCallbacks from './ConfigCallbacks';
import State           from '../models/State';

class ConfigRoot {
    callbacks: ConfigCallbacks = new ConfigCallbacks();
    value:     State           = new State();

    constructor() {
        Object.seal(this);
    }
}

export default ConfigRoot;