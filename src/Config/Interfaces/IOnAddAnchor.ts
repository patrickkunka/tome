import IAnchorData from '../../Shared/Interfaces/IAnchorData';

type IOnAddAnchor = (handlerCreate: (anchorData: IAnchorData) => void) => void;

export default IOnAddAnchor;