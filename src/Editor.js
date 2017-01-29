import State    from './models/State';
import Markup   from './models/Markup';
import Util     from './Util';

class Editor {
    static left(state, range) {
        const newState = Util.extend(new State(), state);
        const isRange = range.from !== range.to;

        if (!isRange && range.from === 0) return state;

        newState.selection = isRange ? [range.from, range.from] : [range.from - 1, range.from - 1];

        return newState;
    }

    static leftSelect(state, range) {
        const newState = Util.extend(new State(), state);

        if (range.from === 0) return state;

        newState.selection = [range.from - 1, range.to];

        return newState;
    }

    static right(state, range) {
        const newState = Util.extend(new State(), state);
        const isRange = range.from !== range.to;

        if (!isRange && range.to === state.text.length) return state;

        newState.selection = isRange ? [range.to, range.to] : [range.to + 1, range.to + 1];

        return newState;
    }

    static rightSelect(state, range) {
        const newState = Util.extend(new State(), state);

        if (range.to === state.text.length) return state;

        newState.selection = [range.from, range.to + 1];

        return newState;
    }

    static home(state, range) {
        const newState = Util.extend(new State(), state);

        let markup = null;

        for (let i = 0; (markup = state.markups[i]); i++) {
            if (markup[1] <= range.from && markup[2] >= range.from) {
                break;
            }
        }

        newState.selection = [markup[1], markup[1]];

        return newState;
    }

    static homeSelect(state, range) {
        const newState = Util.extend(new State(), state);

        let markup = null;

        for (let i = 0; (markup = state.markups[i]); i++) {
            if (markup[1] <= range.from && markup[2] >= range.from) {
                break;
            }
        }

        newState.selection = [markup[1], range.from];

        return newState;
    }

    static end(state, range) {
        const newState = Util.extend(new State(), state);

        let markup = null;

        for (let i = 0; (markup = state.markups[i]); i++) {
            if (markup[1] <= range.to && markup[2] >= range.to) {
                break;
            }
        }

        newState.selection = [markup[2], markup[2]];

        return newState;
    }

    static endSelect(state, range) {
        const newState = Util.extend(new State(), state);

        let markup = null;

        for (let i = 0; (markup = state.markups[i]); i++) {
            if (markup[1] <= range.to && markup[2] >= range.to) {
                break;
            }
        }

        newState.selection = [range.from, markup[2]];

        return newState;
    }

    static insert(state, range, characters) {
        const newState = new State();
        const totalDeleted = range.to - range.from;

        let totalAdded = characters.length;
        let adjustment = totalAdded - totalDeleted;
        let collapsed = '';
        let totalCollapsed = 0;

        newState.text = state.text.slice(0, range.from) + characters + state.text.slice(range.to);

        collapsed = Editor.collapseWhitespace(newState.text);

        if ((totalCollapsed = newState.text.length - collapsed.length) > 0) {
            totalAdded -= totalCollapsed;
            adjustment -= totalCollapsed;

            newState.text = collapsed;
        }

        newState.markups = Editor.adjustMarkups(state.markups, range.from, range.to, totalAdded, adjustment, newState.text);

        newState.selection = [range.from + totalAdded, range.from + totalAdded];

        return newState;
    }

    static collapseWhitespace(text) {
        // Replace 3 or more spaces with a single space.

        let collapsed = text.replace(/ {3,}/g, ' ');

        // Replace 1 or more spaces before a new line with a single space

        collapsed = text.replace(/ +\n/g, ' \n');

        // Disallow spaces at the start of a new line

        collapsed = text.replace(/\n */g, '\n');

        return collapsed;
    }

    static backspace(state, range) {
        const newState = new State();
        const isRange = range.from !== range.to;
        const fromIndex = isRange ? range.from : range.to - 1;

        let adjustment = fromIndex - range.to;
        let totalCollapsed = -1;
        let collapsed = '';

        if (range.to === 0) return state;

        newState.text = state.text.slice(0, fromIndex) + state.text.slice(range.to);

        collapsed = Editor.collapseWhitespace(newState.text);

        if ((totalCollapsed = newState.text.length - collapsed.length) > 0) {
            adjustment -= totalCollapsed;

            newState.text = collapsed;
        }

        newState.markups = Editor.adjustMarkups(state.markups, fromIndex, range.to, 0, adjustment, newState.text);

        newState.selection = [fromIndex, fromIndex];

        return newState;
    }

    static delete(state, range) {
        const newState = new State();
        const isRange = range.from !== range.to;
        const toIndex = isRange ? range.to : range.from + 1;

        let adjustment = range.from - toIndex;
        let totalCollapsed = -1;
        let collapsed = '';

        if (range.from === state.text.length) return state;

        newState.text = state.text.slice(0, range.from) + state.text.slice(toIndex);

        collapsed = Editor.collapseWhitespace(newState.text);

        if ((totalCollapsed = newState.text.length - collapsed.length) > 0) {
            adjustment -= totalCollapsed;

            newState.text = collapsed;
        }

        newState.markups = Editor.adjustMarkups(state.markups, range.from, toIndex, 0, adjustment, newState.text);

        newState.selection = [range.from, range.from];

        return newState;
    }

    static adjustMarkups(markups, fromIndex, toIndex, totalAdded, adjustment) {
        const newMarkups = [];

        for (let i = 0, markup; (markup = markups[i]); i++) {
            const [tag, start, end] = markup;
            const newMarkup = new Markup(markup);

            let removeMarkup = false;

            if (!(markup instanceof Markup)) {
                markup = new Markup(markup);
            }

            if (start >= fromIndex && end <= toIndex) {
                // Selection completely envelopes markup

                if (start === fromIndex && totalAdded > 0) {
                    newMarkup[2] = start + totalAdded;
                } else if (!markup.isBlock) {
                    removeMarkup = true;
                }
            } else if (start <= fromIndex && end >= toIndex) {
                // Selection within markup or equal to markup

                newMarkup[2] += adjustment;

                if (markup.isInline && (start === fromIndex && fromIndex === toIndex)) {
                    // Collapsed caret at start of inline markup

                    newMarkup[1] += adjustment;
                }
            } else if (start >= toIndex) {
                // Markup starts after Selection

                newMarkup[1] += adjustment;
                newMarkup[2] += adjustment;
            } else if (fromIndex < start && toIndex > start && toIndex < end) {
                // Selection partially envelopes markup from start

                if (markup.isInline) {
                    newMarkup[1] += (adjustment + (toIndex - start));
                    newMarkup[2] += adjustment;
                } else {
                    // Previous block markup will consume this one, remove

                    removeMarkup = true;
                }
            } else if (fromIndex > start && fromIndex < end && toIndex > end) {
                // Selection partially envelopes markup from end

                if (markup.isInline) {
                    // Extend inline markup to end of insertion

                    newMarkup[2] = fromIndex + totalAdded;
                } else {
                    const nextBlockMarkup = Editor.getNextBlockMarkup(markups, i);

                    // Extend block markup to end of next block +/- adjustment

                    newMarkup[2] = nextBlockMarkup[2] + adjustment;
                }
            }

            if (!removeMarkup) {
                newMarkups.push(newMarkup);
            }
        }

        return newMarkups;
    }

    static getNextBlockMarkup(markups, index) {
        for (let i = index + 1, markup; (markup = markups[i]); i++) {
            if (!(markup instanceof Markup)) {
                markup = new Markup(markup);
            }

            if (markup.isBlock) {
                return markup;
            }
        }

        return null;
    }
}

export default Editor;