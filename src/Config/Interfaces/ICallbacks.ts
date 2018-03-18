import IOnAddAnchor         from './IOnAddAnchor';
import IOnAddCustomBlock    from './IOnAddCustomBlock';
import IOnEditAnchor        from './IOnEditAnchor';
import IOnRemoveCustomBlock from './IOnRemoveCustomBlock';
import IOnStateChange       from './IOnStateChange';
import IOnValueChange       from './IOnValueChange';

interface ICallbacks {
    onStateChange?:       IOnStateChange;
    onAddAnchor?:         IOnAddAnchor;
    onValueChange?:       IOnValueChange;
    onAddCustomBlock?:    IOnAddCustomBlock;
    onRemoveCustomBlock?: IOnRemoveCustomBlock;
    onEditAnchor?:        IOnEditAnchor;
}

export default ICallbacks;