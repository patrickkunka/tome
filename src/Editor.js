import State    from './models/State';
import Markup   from './models/Markup';
import Util     from './Util';

/**
 * A static class of utility functions for performing edits to
 * the editor state.
 */

class Editor {
    /**
     * Inserts zero or more characters into a range, deleting
     * the contents of the range. Adjusts all markups affected by
     * insertion.
     *
     * @static
     * @param {State}  prevState
     * @param {Range}  range
     * @param {string} content
     */

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

        Editor.setActiveMarkups(nextState, nextState.selection);

        return nextState;
    }

    /**
     * Collapses whitespace in a provided string.
     *
     * @static
     * @param {string} text
     * @return {string}
     */

    static collapseWhitespace(text) {
        // Replace 3 or more spaces with a single space.

        let collapsed = text.replace(/ {3,}/g, ' ');

        // Replace 1 or more spaces before a new line with a single space

        collapsed = text.replace(/ +\n/g, ' \n');

        // Disallow spaces at the start of a new line

        collapsed = text.replace(/\n */g, '\n');

        return collapsed;
    }

    static addInlineMarkup(prevState, tag, from, to) {
        const nextState = Util.extend(new State(), prevState, true);

        let insertIndex = -1;

        if (prevState.envelopedBlockMarkups.length > 1) {
            let formattedState = nextState;

            // Split and delegate the command

            formattedState.envelopedBlockMarkups.length = 0;

            prevState.envelopedBlockMarkups.forEach((markup, i) => {
                const formatFrom = i === 0 ? from : markup.start;
                const formatTo   = i === prevState.envelopedBlockMarkups.length - 1 ? to : markup.end;

                formattedState = Editor.addInlineMarkup(formattedState, tag, formatFrom, formatTo);
            });

            return formattedState;
        }

        Editor.ingestMarkups(nextState.markups, tag, from, to);

        for (let i = 0, markup; (markup = nextState.markups[i]); i++) {
            // NB: When inserting an inline markup there should always be at
            // least one block markup in the array

            insertIndex = i + 1;

            if (markup.start > from) {
                break;
            }
        }

        nextState.markups.splice(insertIndex, 0, [tag, from, to]);

        Editor.joinMarkups(nextState.markups, from);
        Editor.joinMarkups(nextState.markups, to);

        return nextState;
    }

    static removeInlineMarkup(prevState, tag, from, to) {
        const nextState = Util.extend(new State(), prevState, true);
        // for each block markup in range, split command to target each
        // one individually if no markup exists either around or at range, abort
        // if at range, remove it
        // if greater than range, split the markup

        console.log('remove', tag, 'at', from, to);

        Editor.joinMarkups(nextState.markups, from);
        Editor.joinMarkups(nextState.markups, to);

        return nextState;
    }

    static replaceBlockMarkup() {

    }

    /**
     * Adjusts the position/length of existing markups in
     * response to characters being added/removed.
     *
     * @static
     * @param {Array.<Markup>} markups
     * @param {number} fromIndex
     * @param {number} toIndex
     * @param {number} totalAdded
     * @param {number} adjustment
     * @return {Array.<Markups>}
     */

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

    /**
     * Returns the next block markup after the markup at the
     * provided index.
     *
     * @static
     * @param {Array.<Markup>} markups
     * @param {number} index
     * @return {(Markup|null)}
     */

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

    /**
     * Splits a markup at the provided index, creating a new markup
     * of the same type starting a character later. Assumes the addition
     * of a single new line character, but this could be provided for
     * further flexibility.
     *
     * @param  {Array.<Markup>} markups
     * @param  {number}         index
     * @return {Array.<Markup>}
     */

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

    /**
     * Joins two adjacent markups at a provided (known) index.
     *
     * @param  {Array.<Markup>} markups
     * @param  {number} index
     * @return {Array.<Markup>}
     */

    static joinMarkups(markups, index) {
        const closingInlines = {};

        let closingBlock = null;

        for (let i = 0; i < markups.length; i++) {
            const markup = new Markup(markups[i]);

            if (markup.end === index) {
                if (markup.isBlock) {
                    closingBlock = markup;
                } else {
                    closingInlines[markup.tag] = markups[i];
                }
            } else if (markup.start === index) {
                let extend = null;

                if (markup.isBlock && closingBlock) {
                    extend = closingBlock;
                } else if (markup.isInline && closingInlines[markup.tag]) {
                    extend = closingInlines[markup.tag];
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

    /**
     * Removes or shortens any markups matching the provided tag within the
     * provided range.
     *
     * @static
     * @param {Array.<Markup>} markups
     * @param {string}         tag
     * @param {number}         from
     * @param {number}         to
     */

    static ingestMarkups(markups, tag, from, to) {
        for (let i = 0, markup; (markup = markups[i]); i++) {
            const [markupTag, markupStart, markupEnd] = markup;

            if (markupTag !== tag) continue;

            if (markupStart >= from && markupEnd <= to) {
                // Markup enveloped, remove

                markups.splice(i, 1);

                i--;
            } else if (markupStart < from && markupEnd > to) {
                // Markup overlaps start, shorten by moving end to
                // start of selection

                markup[2] = from;
            } else if (markupStart > from && markupStart < to) {
                // Markup overlaps end, shorten by moving start to
                // end of selection

                markup[1] = to;
            }
        }
    }

    /**
     * Determines which block and inline markups should be "active"
     * or "enveloped" for particular selection.
     *
     * @static
     * @param  {State} state
     * @param  {Range} range
     * @return {void}
     */

    static setActiveMarkups(state, range) {
        state.activeBlockMarkup = null;

        state.activeInlineMarkups.length    =
        state.envelopedBlockMarkups.length  = 0;

        for (let i = 0; i < state.markups.length; i++) {
            const markup = new Markup(state.markups[i]);

            // Active markups are those that surround the start of the
            // selection and should be highlighted in any UI

            if (markup.start <= range.from && markup.end >= range.from) {
                if (markup.isBlock) {
                    // Only one block markup may be active at a time

                    state.activeBlockMarkup = markup;
                } else if (markup.end >= range.to) {
                    state.activeInlineMarkups.push(markup);
                }
            }

            if (!markup.isBlock) continue;

            // Enveloped block markups are those that are partially or completely
            // enveloped by the selection.

            if (
                (markup.start <= range.from && markup.end >= range.from) ||
                (markup.start <= range.to && markup.end >= range.from)
            ) {
                state.envelopedBlockMarkups.push(markup);
            }
        }
    }
}

export default Editor;