import ActionType from './constants/ActionType';
import IAction    from './interfaces/IAction';
import ITome      from './interfaces/ITome';
import TomeNode   from './models/TomeNode';

class IMEParser {
    public static handleCharacterMutation(mutation: MutationRecord, tome: ITome): IAction {
        const node:        Node     = mutation.target;
        const path:        number[] = tome.getPathFromDomNode(node);
        const virtualNode: TomeNode = tome.getNodeByPath(path, tome.root);
        const prevValue:   string   = virtualNode.text;
        const nextValue:   string   = node.textContent;
        const action:      IAction  = IMEParser.diffStringValues(prevValue, nextValue);

        if (action.type !== ActionType.NONE) {
            action.range.from += virtualNode.start;
            action.range.to   += virtualNode.start;
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

        // Strip off any common characters from start to prevent overlap

        const condensedNextValue = nextValue.slice(localUpdateStartIndex);
        const condensedPrevValue = prevValue.slice(localUpdateStartIndex);

        for (let i = 0; i < prevValue.length; i++) {
            if (
                condensedNextValue[condensedNextValue.length - 1 - i] ===
                condensedPrevValue[condensedPrevValue.length - 1 - i]
            ) continue;

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