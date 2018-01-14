import merge from 'helpful-merge';

import Action      from './Action';
import ActionType  from './Constants/ActionType';
import HtmlEntity  from './Constants/HtmlEntity';
import MarkupTag   from './Constants/MarkupTag';
import Editor      from './Editor';
import Markup      from './Markup';
import State       from './State';

export default (prevState: State, action: Action): State => {
    switch (action.type) {
        case ActionType.SET_SELECTION: {
            const nextState = merge(new State(), prevState, true);

            nextState.markups = prevState.markups.map(markup => new Markup(markup.toArray()));

            Object.assign(nextState.selection, action.range);

            Editor.setActiveMarkups(nextState, action.range);

            return nextState;
        }
        case ActionType.INSERT: {
            return Editor.insert(prevState, {from: action.range.from, to: action.range.to}, action.content);
        }
        case ActionType.REPLACE_VALUE: {
            const nextState = new State(action.data);

            nextState.selection.from = nextState.selection.to = nextState.text.length;

            return nextState;
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
        case ActionType.MUTATE:
            return Editor.insert(prevState, {from: action.range.from, to: action.range.to}, action.content);
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
            const allowedMarkups: string[] = Object.keys(MarkupTag).map(key => MarkupTag[key]);

            let nextState: State;

            if (allowedMarkups.indexOf(action.tag) < 0) {
                throw new RangeError(`[Tome] Unknown markup tag "${action.tag}"`);
            }

            if (action.range.isUnselected) return prevState;

            if (action.range.isCollapsed) {
                // Collapsed selection, create inline markup override

                nextState = merge(new State(), prevState, true);

                nextState.markups = prevState.markups.map(markup => new Markup(markup.toArray()));

                nextState.activeInlineMarkups.overrides.push(action.tag);

                return nextState;
            }

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
            return Editor.insert(prevState, {from: action.range.from, to: action.range.to}, '');
        case ActionType.COPY:
            return prevState;
        case ActionType.PASTE:
            return Editor.insertFromClipboard(prevState, action.data, action.range.from, action.range.to);
        case ActionType.SAVE:
            return prevState;
        default:
            return prevState;
    }
};