import ICallbacks           from './Interfaces/ICallbacks';
import IOnAddAnchor         from './Interfaces/IOnAddAnchor';
import IOnAddCustomBlock    from './Interfaces/IOnAddCustomBlock';
import IOnEditAnchor        from './Interfaces/IOnEditAnchor';
import IOnRemoveCustomBlock from './Interfaces/IOnRemoveCustomBlock';
import IOnStateChange       from './Interfaces/IOnStateChange';
import IOnValueChange       from './Interfaces/IOnValueChange';

class Callbacks implements ICallbacks {
    public onStateChange:       IOnStateChange       = null;
    public onAddAnchor:         IOnAddAnchor         = null;
    public onValueChange:       IOnValueChange       = null;
    public onAddCustomBlock:    IOnAddCustomBlock    = null;
    public onRemoveCustomBlock: IOnRemoveCustomBlock = null;
    public onEditAnchor:        IOnEditAnchor        = null;

    constructor() {
        Object.seal(this);
    }
}

export default Callbacks;