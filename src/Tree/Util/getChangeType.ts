import NodeChangeType from '../Constants/NodeChangeType';
import TomeNode       from '../TomeNode';

function getChangeType(prevNode: TomeNode = null, nextNode: TomeNode = null): NodeChangeType {
    if (prevNode && !nextNode) {
        return NodeChangeType.REMOVE;
    }

    if (nextNode && !prevNode) {
        return NodeChangeType.ADD;
    }

    if (
        prevNode && nextNode &&
        prevNode.childNodes.length === 0 && nextNode.childNodes.length === 0
    ) {
        // Text nodes

        return prevNode.text === nextNode.text ? NodeChangeType.NONE : NodeChangeType.UPDATE_TEXT;
    }

    // HTML elements

    let hasChildChanges = prevNode.childNodes.length !== nextNode.childNodes.length;

    if (!hasChildChanges) {
        hasChildChanges = prevNode.childNodes
            .some((prevChild, i) => getChangeType(prevChild, nextNode.childNodes[i]) !== NodeChangeType.NONE);
    }

    if (prevNode.tag !== nextNode.tag) {
        return hasChildChanges ? NodeChangeType.UPDATE_ALL : NodeChangeType.UPDATE_TAG;
    }

    return hasChildChanges ? NodeChangeType.UPDATE_CHILDREN : NodeChangeType.NONE;
}

export default getChangeType;