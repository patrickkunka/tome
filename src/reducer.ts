import ActionType  from './constants/ActionType';
import HtmlEntity  from './constants/HtmlEntity';
import Editor      from './Editor';
import Action      from './models/Action';
import Markup      from './models/Markup';
import State       from './models/State';
import Util        from './Util';

export default (prevState: State, action: Action): State|Promise<State> => {
    switch (action.type) {
        case ActionType.SET_SELECTION: {
            const nextState = Util.extend(new State(), prevState, true);

            nextState.markups = prevState.markups.map(markup => new Markup(markup.toArray()));

            Object.assign(nextState.selection, action.range);

            Editor.setActiveMarkups(nextState, action.range);

            return nextState;
        }
        case ActionType.INSERT: {
            return Editor.insert(prevState, {from: action.range.from, to: action.range.to}, action.content);
        }
        case ActionType.BACKSPACE: {
            let fromIndex: number = action.range.from;

            // If at start, ignore

            if (action.range.to === 0) return prevState;

            if (action.range.isCollapsed) {
                // If previous character is a block break, ingest previous two characters, else one

                const precedingSample = prevState.text.slice(action.range.from - 2, action.range.from);

                fromIndex = precedingSample === HtmlEntity.BLOCK_BREAK ? action.range.from - 2 : action.range.from - 1;
            }

            return Editor.insert(prevState, {from: fromIndex, to: action.range.to}, '');
        }
        case ActionType.DELETE: {
            let toIndex: number = action.range.to;

            // If at end, ignore

            if (action.range.from === prevState.text.length) return prevState;

            if (action.range.isCollapsed) {
                // If succeeding characer is a block break, ingest following two characers, else one

                const succeedingSample = prevState.text.slice(action.range.to, action.range.to + 2);

                toIndex = succeedingSample === HtmlEntity.BLOCK_BREAK ? action.range.to + 2 : action.range.to + 1;
            }

            return Editor.insert(prevState, {from: action.range.from, to: toIndex}, '');
        }
        case ActionType.RETURN:
            return Editor.insert(prevState, action.range, HtmlEntity.BLOCK_BREAK);
        case ActionType.SHIFT_RETURN: {
            // detect if inserting a line break directly before or
            // after an existing line break

            const precedingSample = prevState.text.slice(action.range.from - 2, action.range.from);

            if (precedingSample.match(/(\S|^)\n$/)) {
                // Matches single preceeding newline

                return Editor.insert(
                    prevState,
                    {from: action.range.from - 1, to: action.range.to},
                    HtmlEntity.BLOCK_BREAK
                );

                // TODO: br tag is not being ingested
            }

            const succeedingSample = prevState.text.slice(action.range.to, action.range.to + 2);

            if (succeedingSample.match(/^\n(\S|$)/)) {
                // Matches single succeeding newline character

                return Editor.insert(
                    prevState,
                    {from: action.range.from, to: action.range.to + 1},
                    HtmlEntity.BLOCK_BREAK
                );
            }

            return Editor.insert(prevState, action.range, HtmlEntity.LINE_BREAK);
        }
        case ActionType.TOGGLE_INLINE: {
            let nextState: State;

            // TODO: if collapsed, simply change state to disable/enable active
            // markup, any further set selections will reset it as appropriate

            if (prevState.isTagActive(action.tag)) {
                nextState = Editor.removeInlineMarkup(prevState, action.tag, action.range.from, action.range.to);
            } else {
                nextState = Editor.addInlineMarkup(
                    prevState,
                    action.tag,
                    action.range.from,
                    action.range.to,
                    action.data
                );
            }

            Editor.setActiveMarkups(nextState, action.range);

            return nextState;
        }
        case ActionType.CHANGE_BLOCK_TYPE: {
            return Editor.changeBlockType(prevState, action.tag);
        }
        case ActionType.CUT:
            return prevState;
        case ActionType.COPY:
            return prevState;
        case ActionType.PASTE:
            return  Editor.insertFromClipboard(prevState, action.data, action.range.from, action.range.to);
        case ActionType.SAVE:
            return prevState;
        default:
            return prevState;
    }
};