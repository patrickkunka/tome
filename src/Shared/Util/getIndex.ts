function getIndex(node: Node, includeNonElements: boolean = false): number {
    const previousSiblingType = includeNonElements ? 'previousSibling' : 'previousElementSibling';

    let index = 0;

    while ((node = node[previousSiblingType]) !== null) {
        index++;
    }

    return index;
}

export default getIndex;