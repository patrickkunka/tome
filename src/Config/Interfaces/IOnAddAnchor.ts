import IAnchorData from '../../Dom/Interfaces/IAnchorData';

type IOnAddAnchor = (handlerCreate: (anchorData: IAnchorData) => void) => void;

export default IOnAddAnchor;