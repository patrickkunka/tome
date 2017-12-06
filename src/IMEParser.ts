import ActionType from './constants/ActionType';
import IAction    from './interfaces/IAction';
import ITome      from './interfaces/ITome';

class IMEParser {
    public static handleCharacterMutation(mutation: MutationRecord, tome: ITome, isComposing: boolean): IAction {
        const node = mutation.target;
        const path = tome.getPathFromDomNode(node);
        const virtualNode = tome.getNodeByPath(path, tome.root);
        const prevValue = virtualNode.text;
        const nextValue = node.textContent;
        const action: IAction = {type: ActionType.NONE};

        if (prevValue === nextValue) return action;

        action.type = ActionType.MUTATE;

        // TODO: move into easily testable string diff function

        // start from either end of string and work inward to find
        // determine edit

        if (nextValue.length >= prevValue.length) {
            // Update with longer or equal string, e.g:

            // prev: "two th|e four"
            // next: "two th|re|e four"

            // updateStart: 6
            // updateEnd: 6 (from end) => 12 - 6 => 6
            // content: slice through 6 to 6-from-end of next => "re"

            let localUpdateStartIndex: number;
            let localUpdateEndIndexFromEnd: number;

            // TODO: move into easily testable string diff function

            // start from either end of string and work inward to find
            // determine edit

            for (let i = 0; i < nextValue.length; i++) {
                if (nextValue[i] === prevValue[i]) continue;

                localUpdateStartIndex = i;

                break;
            }

            for (let i = 0; i < prevValue.length; i++) {
                if (nextValue[nextValue.length - 1 - i] === prevValue[prevValue.length - 1 - i]) continue;

                localUpdateEndIndexFromEnd = i;

                break;
            }

            action.content = nextValue.slice(localUpdateStartIndex, nextValue.length - localUpdateEndIndexFromEnd);

            action.range = {
                from: virtualNode.start + localUpdateStartIndex,
                to: virtualNode.start + prevValue.length - localUpdateEndIndexFromEnd
            };
        } else if (isComposing) {
            // update with shorter string, e.g:

            // prev: "two th|re|e four"
            // next: "two th|e four"

            // ...
        } else {
            // deleting

            const totalDeleted = prevValue.length - nextValue.length;

            let localDeletionStartIndex: number;

            for (let i = 0; i < prevValue.length; i++) {
                if (nextValue[i] === prevValue[i]) continue;

                localDeletionStartIndex = i;

                break;
            }

            action.content = '';

            action.range = {
                from: virtualNode.start + localDeletionStartIndex,
                to: virtualNode.start + localDeletionStartIndex + totalDeleted
            };
        }

        return action;
    }
}

export default IMEParser;