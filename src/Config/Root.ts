import State     from '../State/State';
import Callbacks from './Callbacks';
import Debug     from './Debug';

class Root {
    public callbacks = new Callbacks();
    public debug     = new Debug();
    public value     = new State();

    constructor() {
        Object.seal(this);
    }
}

export default Root;