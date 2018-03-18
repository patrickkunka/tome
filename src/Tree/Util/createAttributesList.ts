import IAnchorData from '../../Dom/Interfaces/IAnchorData';
import MarkupTag   from '../../State/Constants/MarkupTag';
import RenderMode  from '../Constants/RenderMode';

function createAttributesList(mode: RenderMode, tag: MarkupTag, data: any): string[] {
    const attributesMap: any = {};
    const attributesList: string[] = [];

    switch (tag) {
        case MarkupTag.A:
            if (mode === RenderMode.CONSUMER) {
                const {href, target, title}: IAnchorData = data;

                attributesMap.href = href;

                if (target) {
                    attributesMap.target = target;
                }

                if (title) {
                    attributesMap.title = title;
                }
            } else {
                attributesMap.href = 'javascript:void(0)';
            }

            break;
        case MarkupTag.DIV:
            attributesMap.contenteditable = 'false';

            break;
    }

    for (const attributeName in attributesMap) {
        attributesList.push(`${attributeName}="${attributesMap[attributeName]}"`);
    }

    return attributesList;
}

export default createAttributesList;