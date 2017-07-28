import State    from './models/State';
import Markup   from './models/Markup';

class Editor {
    static insert(prevState, range, content) {
        const nextState = new State();

        const totalDeleted = range.to - range.from;

        let totalAdded = content.length;
        let adjustment = totalAdded - totalDeleted;
        let collapsed = '';
        let totalCollapsed = 0;

        nextState.text =
            prevState.text.slice(0, range.from) +
            content +
            prevState.text.slice(range.to);

        collapsed = Editor.collapseWhitespace(nextState.text);

        if ((totalCollapsed = nextState.text.length - collapsed.length) > 0) {
            totalAdded -= totalCollapsed;
            adjustment -= totalCollapsed;

            nextState.text = collapsed;
        }

        nextState.markups = Editor.adjustMarkups(
            prevState.markups,
            range.from,
            range.to,
            totalAdded,
            adjustment
        );

        if (content === '\n') {
            nextState.markups = Editor.splitMarkups(nextState.markups, range.from);
        } else if (content === '') {
            nextState.markups = Editor.joinMarkups(nextState.markups, range.from);
        }

        nextState.selection.from =
        nextState.selection.to   = range.from + totalAdded;

        return nextState;
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

    static toggleMarkup(markups, fromIndex, toIndex, tag) {
        let parentBlock   = null;
        let currentMarkup = null;
        let nextMarkup    = null;

        for (let i = 0; i < markups.length; i++) {
            currentMarkup = nextMarkup ? nextMarkup : new Markup(markups[i]);
            nextMarkup = new Markup(markups[i + 1]);

            if (currentMarkup.isBlock) {
                parentBlock = currentMarkup;
            }

            if (fromIndex >= parentBlock.start && toIndex <= parentBlock.end) {
                if (currentMarkup.start <= fromIndex && nextMarkup.start > toIndex) {
                    const newMarkup = [tag, fromIndex, toIndex];

                    markups.splice(i + 1, 0, newMarkup);

                    break;
                }
            } else {
                // overlap

                console.log('overlap');
            }
        }

        // Iterate through markups, hold reference to current block parent
        // if new markup is within parent, add markup at logical index (by start index)
        // if new markup overlaps block parents, split and add where permissable
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