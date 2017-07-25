import State    from './models/State';
import Markup   from './models/Markup';

class Editor {
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

        newState.markups = Editor.adjustMarkups(state.markups, range.from, range.to, totalAdded, adjustment);

        if (characters === '\n') {
            newState.markups = Editor.splitMarkups(newState.markups, range.from);
        }

        if (characters === '') {
            newState.markups = Editor.joinMarkups(newState.markups, range.from);
        }

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
        const isRange = range.from !== range.to;
        const fromIndex = isRange ? range.from : range.to - 1;

        if (range.to === 0) return state;

        return Editor.insert(state, {from: fromIndex, to: range.to}, '');
    }

    static delete(state, range) {
        const isRange = range.from !== range.to;
        const toIndex = isRange ? range.to : range.from + 1;

        if (range.from === state.text.length) return state;

        return Editor.insert(state, {from: range.from, to: toIndex}, '');
    }

    static return(state, range) {
        // TODO: Disallow if already empty line

        return Editor.insert(state, range, '\n');
    }

    static adjustMarkups(markups, fromIndex, toIndex, totalAdded, adjustment) {
        const newMarkups = [];

        for (let i = 0, markup; (markup = markups[i]); i++) {
            const [tag, markupStart, markupEnd] = markup;
            const newMarkup = new Markup(markup);

            let removeMarkup = false;

            if (!(markup instanceof Markup)) {
                markup = new Markup(markup);
            }

            if (markupStart >= fromIndex && markupEnd <= toIndex) {
                // Selection completely envelopes markup

                if (markupStart === fromIndex && (markup.isBlock || markup.isInline && totalAdded > 0)) {
                    // Markup should be preserved is a) is block element,
                    // b) is inline and inserting
                    newMarkup[2] = markupStart + totalAdded;
                } else if (!markup.isBlock) {
                    removeMarkup = true;
                }
            } else if (markupStart <= fromIndex && markupEnd >= toIndex) {
                // Selection within markup or equal to markup

                newMarkup[2] += adjustment;

                if (markup.isInline && (markupStart === fromIndex && fromIndex === toIndex)) {
                    // Collapsed caret at start of inline markup

                    newMarkup[1] += adjustment;
                }
            } else if (markupStart >= toIndex) {
                // Markup starts after Selection

                newMarkup[1] += adjustment;
                newMarkup[2] += adjustment;
            } else if (fromIndex < markupStart && toIndex > markupStart && toIndex < markupEnd) {
                // Selection partially envelopes markup from start

                if (markup.isInline) {
                    newMarkup[1] += (adjustment + (toIndex - markupStart));
                    newMarkup[2] += adjustment;
                } else {
                    // Previous block markup will consume this one, remove

                    removeMarkup = true;
                }
            } else if (fromIndex > markupStart && fromIndex < markupEnd && toIndex > markupEnd) {
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

    static splitMarkups(markups, index) {
        for (let i = 0, markup; (markup = markups[i]); i++) {
            const [markupTag, markupStart, markupEnd] = markup;

            let newMarkup = null;

            if (markupStart <= index && markupEnd >= index) {
                const newTag = markup.isBlock && markupEnd === index + 1 ? 'p' : markupTag;

                markup[2] = index;

                newMarkup = new Markup([newTag, index + 1, markupEnd]);

                markups.splice(i + 1, 0, newMarkup);

                i++;
            }
        }

        return markups;
    }

    static joinMarkups(markups, index) {
        const closingInlines = {};

        let closingBlock = null;

        for (let i = 0, markup; (markup = markups[i]); i++) {
            const [markupTag, markupStart, markupEnd] = markup;

            if (markupEnd === index) {
                if (markup.isBlock) {
                    closingBlock = markup;
                } else {
                    closingInlines[markupTag] = markup;
                }
            } else if (markupStart === index) {
                let extend = null;

                if (markup.isBlock && closingBlock) {
                    extend = closingBlock;
                } else if (markup.isInline && closingInlines[markupTag]) {
                    extend = closingInlines[markupTag];
                }

                if (extend) {
                    extend[2] = markup[2];

                    markups.splice(i, 1);

                    i--;
                }
            }
        }

        return markups;
    }
}

export default Editor;