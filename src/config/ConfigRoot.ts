import State           from '../models/State';
import ConfigCallbacks from './ConfigCallbacks';

class ConfigRoot {
    public callbacks: ConfigCallbacks = new ConfigCallbacks();
    public value:     State           = new State();

    constructor() {
        Object.seal(this);
    }
}

export default ConfigRoot;