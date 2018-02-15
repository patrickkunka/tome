import TomeNode from '../TomeNode';

function isEqualNode(prevNode: TomeNode, nextNode: TomeNode): boolean {
    return prevNode.tag === nextNode.tag && prevNode.text === nextNode.text;
}

export default isEqualNode;