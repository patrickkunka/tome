import MarkupTag from '../../State/Constants/MarkupTag';

function createAttributesList(tag: MarkupTag): string[] {
    const attributesMap: any = {};
    const attributesList: string[] = [];

    switch (tag) {
        case MarkupTag.A:
            attributesMap.href = 'javascript:void(0)';

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