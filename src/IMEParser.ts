import ActionType   from './constants/ActionType';
import IAction      from './interfaces/IAction';
import ITome        from './interfaces/ITome';
import TomeNode     from './models/TomeNode';
import MutationType from './constants/MutationType';
import MarkupTag    from './constants/MarkupTag';
import HtmlEntity   from './constants/HtmlEntity';

class IMEParser {
    public static handleCharacterMutation(mutation: MutationRecord, mutations: MutationRecord[], tome: ITome): IAction {
        const node: Node = mutation.target;

        let path: number[];

        if (!tome.dom.root.contains(node)) {
            // The mutated text node was also deleted, find the path
            // of its parent block to find the virtual node

            const mutationIndex = mutations.indexOf(mutation);

            let parentBlock: HTMLElement = null;

            for (let i = mutationIndex; i < mutations.length; i++) {
                const nextMutation = mutations[i];

                if (nextMutation.type !== MutationType.CHILD_LIST) continue;

                parentBlock = nextMutation.target as HTMLElement;

                break;
            }

            const parentPath = tome.getPathFromDomNode(parentBlock);

            path = parentPath.concat(0);
        } else {
            path = tome.getPathFromDomNode(node);
        }

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

    public static handleBlockMutation(mutation: MutationRecord, _mutations: MutationRecord[], tome: ITome): IAction {
        const beforeRemoved = mutation.previousSibling;
        const path = tome.getPathFromDomNode(beforeRemoved);

        // Increment previous sibling path to find own path

        path[path.length - 1]++;

        const virtualNode = tome.getNodeByPath(path, tome.root);

        // If node is not a block break, ignore

        if (virtualNode.tag !== MarkupTag.TEXT || virtualNode.text !== HtmlEntity.BLOCK_BREAK) return;

        // Delete over block break

        const action = {
            type: ActionType.INSERT,
            range: {
                from: virtualNode.start,
                to: virtualNode.end
            }
        };

        console.log('insert via delete mutation:', action);

       return action;
    }

    public static diffStringValues(prevValue, nextValue): IAction {
        const action: IAction = {type: ActionType.NONE};

        if (prevValue === nextValue) return action;

        const maxLength = Math.max(prevValue.length, nextValue.length);

        let localUpdateStartIndex: number;
        let localUpdateEndIndexFromEnd: number = 0;

        action.type = ActionType.MUTATE;

        // start from either end of string and work inward to
        // determine edit boundary

        for (let i = 0; i < maxLength; i++) {
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