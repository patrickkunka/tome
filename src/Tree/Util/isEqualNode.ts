import TomeNode from '../TomeNode';

function isEqualNode(prevNode: TomeNode = null, nextNode: TomeNode = null): boolean {
    return (
        prevNode && nextNode &&
        prevNode.tag === nextNode.tag &&
        prevNode.text === nextNode.text
    );
}

export default isEqualNode;