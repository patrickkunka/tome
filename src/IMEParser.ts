import ActionType from './constants/ActionType';
import IAction    from './interfaces/IAction';
import ITome      from './interfaces/ITome';

class IMEParser {
    public static handleBasicCharacterMutation(mutation: MutationRecord, tome: ITome): IAction {
        const node = mutation.target;
        const path = tome.getPathFromDomNode(node);
        const virtualNode = tome.getNodeByPath(path, tome.root);
        const prevValue = virtualNode.text;
        const nextValue = node.textContent;

        if (nextValue.length > prevValue.length) return;

        // Deleted a character

        const totalDeleted = prevValue.length - nextValue.length;

        const action: IAction = {type: ActionType.DELETE_VIA_MUTATION};

        let localDeletionStartIndex;

        for (let i = 0; i < prevValue.length; i++) {
            if (nextValue[i] === prevValue[i]) continue;

            localDeletionStartIndex = i;
        }

        action.range = {
            from: virtualNode.start + localDeletionStartIndex,
            to: virtualNode.start + localDeletionStartIndex + totalDeleted
        };

        return action;
    }

    public static handleCompositionMutation(mutation: MutationRecord, tome: ITome): IAction {
        console.log('composition mutation', mutation, tome);

        return {type: ActionType.NONE};
    }
}

export default IMEParser;