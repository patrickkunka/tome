import ConfigCallbacks from './ConfigCallbacks';
import State           from '../models/State';

class ConfigRoot {
    constructor() {
        this.callbacks = new ConfigCallbacks();
        this.value     = new State();

        Object.seal(this);
    }
}

export default ConfigRoot;