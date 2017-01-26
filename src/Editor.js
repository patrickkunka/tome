import State    from './models/State';
import Markup   from './models/Markup';
import Util     from './Util';

class Editor {
    static left(state, range) {
        const newState = Util.extend(new State(), state);
        const isRange = range.from !== range.to;

        newState.selection = isRange ? [range.from, range.from] : [range.from - 1, range.from - 1];

        return newState;
    }

    static right(state, range) {
        const newState = Util.extend(new State(), state);
        const isRange = range.from !== range.to;

        newState.selection = isRange ? [range.to, range.to] : [range.to + 1, range.to + 1];

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
        const totalAdded = characters.length;
        const adjustment = totalAdded - totalDeleted;

        newState.text = state.text.slice(0, range.from) + characters + state.text.slice(range.to);

        newState.markups = Editor.adjustMarkups(state.markups, range.from, range.to, totalAdded, adjustment, newState.text);

        newState.selection = [range.from + totalAdded, range.from + totalAdded];

        return newState;
    }

    static backspace(state, range) {
        const newState = new State();
        const isRange = range.from !== range.to;
        const fromIndex = isRange ? range.from : range.to - 1;
        const adjustment = fromIndex - range.to;

        if (range.to === 0) return state;

        newState.text = state.text.slice(0, fromIndex) + state.text.slice(range.to);
        newState.markups = Editor.adjustMarkups(state.markups, fromIndex, range.to, 0, adjustment, newState.text);

        newState.selection = [fromIndex, fromIndex];

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

            // Selection completely envelopes markup

            if (start > fromIndex && end < toIndex) {
                removeMarkup = true;
            }

            if (start <= fromIndex && end >= toIndex) {
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