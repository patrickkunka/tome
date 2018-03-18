import IValue     from '../../State/Interfaces/IValue';
import ICallbacks from './ICallbacks';
import IDebug     from './IDebug';
import IHistory   from './IHistory';

interface IConfig {
    callbacks?: ICallbacks;
    debug?:     IDebug;
    history?:   IHistory;
    value?:     IValue;
}

export default IConfig;