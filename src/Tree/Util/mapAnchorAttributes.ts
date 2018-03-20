import IAnchorData    from '../../Shared/Interfaces/IAnchorData';
import RenderMode     from '../Constants/RenderMode';
import IAttributesMap from '../Interfaces/IAttributesMap';

function mapAnchorAttributes(mode, {href, target, title}: IAnchorData): IAttributesMap {
    const attributesMap: IAttributesMap = {};

    switch (mode) {
        case RenderMode.CONSUMER:
            attributesMap.href = href;

            if (target) {
                attributesMap.target = target;
            }

            if (title) {
                attributesMap.title = title;
            }

            break;
        case RenderMode.EDITOR:
            attributesMap['data-href'] = href;
            attributesMap.href = 'javascript:void(0)';

            break;
    }

    return attributesMap;
}

export default mapAnchorAttributes;