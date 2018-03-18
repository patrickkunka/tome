import MarkupTag           from '../../State/Constants/MarkupTag';
import RenderMode          from '../Constants/RenderMode';
import IAttributesMap      from '../Interfaces/IAttributesMap';
import mapAnchorAttributes from './mapAnchorAttributes';

function createAttributesDomString(mode: RenderMode, tag: MarkupTag, data: any): string {
    const attributesList: string[] = [];

    let attributesMap: IAttributesMap;

    switch (tag) {
        case MarkupTag.A:
            attributesMap = mapAnchorAttributes(mode, data);

            break;
        case MarkupTag.DIV:
            attributesMap = {
                contenteditable: 'false'
            };

            break;
    }

    for (const attributeName in attributesMap) {
        attributesList.push(`${attributeName}="${attributesMap[attributeName]}"`);
    }

    return attributesList.length > 0 ? ' ' + attributesList.join(' ') : '';
}

export default createAttributesDomString;