import INodeLike from '../Interfaces/INodeLike';

/**
 * Returns a child node of a provided `INodeLike` based on a provided path.
 */

function getNodeByPath<T extends INodeLike>(path: number[], root: T): T {
    let node: T = root;
    let index = -1;
    let i = 0;

    while (typeof (index = path[i]) === 'number' && typeof node !== 'undefined') {
        node = node.childNodes[index];

        i++;
    }

    return node || null;
}

export default getNodeByPath;