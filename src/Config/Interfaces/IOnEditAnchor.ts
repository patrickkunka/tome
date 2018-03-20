import IAnchorData from '../../Shared/Interfaces/IAnchorData';

type IOnEditAnchor = (
    handlerUpdate: (anchorData: IAnchorData) => void,
    currentAnchorData: IAnchorData
) => void;

export default IOnEditAnchor;