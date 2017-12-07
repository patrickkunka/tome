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

        const action: IAction = IMEParser.diffStringValues(prevValue, nextValue);

        isComposing;

        if (action.type !== ActionType.NONE) {
            action.range.from += virtualNode.start;
            action.range.to   += virtualNode.end;
        }

        return action;
    }

    public static diffStringValues(prevValue, nextValue): IAction {
        const action: IAction = {type: ActionType.NONE};

        if (prevValue === nextValue) return action;

        action.type = ActionType.MUTATE;

        let localUpdateStartIndex: number;
        let localUpdateEndIndexFromEnd: number;

        // start from either end of string and work inward to
        // determine edit boundary

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
            from: localUpdateStartIndex,
            to: prevValue.length - localUpdateEndIndexFromEnd
        };

        return action;
    }
}

export default IMEParser;