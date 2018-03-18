import IDebug from './Interfaces/IDebug';

class Debug implements IDebug {
    public enable = false;

    constructor() {
        Object.seal(this);
    }
}

export default Debug;