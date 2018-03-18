import State     from '../State/State';
import Callbacks from './Callbacks';
import Debug     from './Debug';
import History   from './History';
import IConfig   from './Interfaces/IConfig';

class Root implements IConfig {
    public callbacks = new Callbacks();
    public debug     = new Debug();
    public history   = new History();
    public value     = new State();

    constructor() {
        Object.seal(this);
    }
}

export default Root;