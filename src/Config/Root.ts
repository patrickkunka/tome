import State     from '../State/State';
import Callbacks from './Callbacks';
import Debug     from './Debug';
import History   from './History';

class Root {
    public callbacks = new Callbacks();
    public debug     = new Debug();
    public history   = new History();
    public value     = new State();

    constructor() {
        Object.seal(this);
    }
}

export default Root;