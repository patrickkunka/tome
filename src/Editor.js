import State        from './models/State';
import Markup       from './models/Markup';
import Util         from './Util';

import {LINE_BREAK} from './constants/Markups';

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

        let before = prevState.text.slice(0, range.from);
        let after  = prevState.text.slice(range.to);
        let totalAdded = content.length;
        let adjustment = totalAdded - totalDeleted;
        let totalTrimmed = 0;

        nextState.text = before + content + after;

        nextState.markups = Editor.adjustMarkups(
            prevState.markups,
            range.from,
            range.to,
            totalAdded,
            adjustment
        );

        if (content === LINE_BREAK) {
            nextState.markups = Editor.splitMarkups(nextState.markups, range.from);
        } else if (content === '') {
            nextState.markups = Editor.joinMarkups(nextState.markups, range.from);
        }

        totalTrimmed = Editor.trimWhitespace(nextState);

        console.log(totalTrimmed, totalAdded, totalDeleted);

        nextState.selection.from =
        nextState.selection.to   = range.from + totalAdded + totalTrimmed;

        Editor.setActiveMarkups(nextState, nextState.selection);

        return nextState;
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

        for (let i = 0; i < nextState.markups.length; i++) {
            const markup = new Markup(nextState.markups[i]);

            // NB: When inserting an inline markup there should always be at
            // least one block markup in the array

            insertIndex = i;

            if (markup.isInline && markup.start > from) {
                break;
            } else if (markup.isBlock && markup.start <= from && markup.end >= to) {
                insertIndex++;

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

        if (prevState.envelopedBlockMarkups.length > 1) {
            let formattedState = nextState;

            // Split and delegate the command

            formattedState.envelopedBlockMarkups.length = 0;

            prevState.envelopedBlockMarkups.forEach((markup, i) => {
                const formatFrom = i === 0 ? from : markup.start;
                const formatTo   = i === prevState.envelopedBlockMarkups.length - 1 ? to : markup.end;

                formattedState = Editor.removeInlineMarkup(formattedState, tag, formatFrom, formatTo);
            });

            return formattedState;
        }

        Editor.ingestMarkups(nextState.markups, tag, from, to);

        // Editor.joinMarkups(nextState.markups, from);
        // Editor.joinMarkups(nextState.markups, to);

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
     * Trims leading/trailing whitespace from block elements.
     * Returns the total adjustment made to the text.
     *
     * @param  {State} nextState
     * @return {number}
     */

    static trimWhitespace(nextState) {
        let totalAllTrimmed = 0;

        for (let i = 0; i < nextState.markups.length; i++) {
            const markupRaw = nextState.markups[i];
            const markup    = new Markup(markupRaw);

            if (totalAllTrimmed !== 0) {
                // If previous adjustments have been made, adjust markup
                // position accordingly

                markupRaw[1] += totalAllTrimmed;
                markupRaw[2] += totalAllTrimmed;
            }

            if (!markup.isBlock) continue;

            const before  = nextState.text.slice(0, markup.start);
            const content = nextState.text.slice(markup.start, markup.end);
            const after   = nextState.text.slice(markup.end);

            // Trim whitespace from start and end of blocks

            const trimmed = content.trim();
            const totalTrimmed = trimmed.length - content.length;

            console.log('before:', content.replace(/\s/g, '-'));
            console.log('after:', trimmed.replace(/\s/g, '-'));
            console.log('total:', totalTrimmed);

            // TODO: seems not to be quite working.. needs further
            // investigation?

            if (totalTrimmed === 0) continue;

            totalAllTrimmed += totalTrimmed;

            // Reduce markup end by trimmed amount

            markupRaw[2] += totalTrimmed;

            // Rebuild text

            nextState.text = before + trimmed + after;
        }

        return totalAllTrimmed;
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
            const markup = markups[i];

            if (markup.end === index) {
                if (markup.isBlock) {
                    // Block markup closes at index

                    closingBlock = markup;
                } else {
                    closingInlines[markup.tag] = markups[i];
                }
            } else if (markup.start === index) {
                let extend = null;

                if (markup.isBlock && closingBlock) {
                    // Block markup opens at index, and will touch
                    // previous block

                    extend = closingBlock;
                } else if (markup.isInline && closingInlines[markup.tag]) {
                    extend = closingInlines[markup.tag];
                }

                if (extend) {
                    // Block should be extended

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

            // TODO: final case: remove internal range of markup and split into two
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

        state.activeInlineMarkups.length   =
        state.envelopedBlockMarkups.length = 0;

        let adjacentInlineMarkups = [];
        let parentBlock = null;

        for (let i = 0; i < state.markups.length; i++) {
            const markup = new Markup(state.markups[i]);
            const lastAdjacent = adjacentInlineMarkups[adjacentInlineMarkups.length - 1];

            // Active markups are those that surround the start of the
            // selection and should be highlighted in any UI

            if (markup.start <= range.from && markup.end >= range.from) {
                if (markup.isBlock) {
                    // Only one block markup may be active at a time
                    // (the first one)

                    state.activeBlockMarkup = markup;
                } else if (markup.end >= range.to) {
                    // Simple enveloped inline markup

                    state.activeInlineMarkups.push(markup);
                } else if (markup.end === parentBlock.end) {
                    // Potential first adjacent inline markup

                    adjacentInlineMarkups.push(markup);

                    continue;
                }
            }

            if (
                lastAdjacent && lastAdjacent.tag === markup.tag &&
                (
                    markup.start === parentBlock.start && markup.end >= range.to ||
                    markup.start === parentBlock.start && markup.end === parentBlock.end
                )
            ) {
                // Continuation or end of an adjacent inline markup

                adjacentInlineMarkups.push(markup);

                if (range.to <= markup.end) {
                    // Final adjacent inline markup, move all to state

                    state.activeInlineMarkups.push(...adjacentInlineMarkups);
                }
            } else if (markup.isInline) {
                // Doesn't match tag, or not a continuation, reset

                adjacentInlineMarkups.length = 0;
            }

            if (!markup.isBlock) continue;

            parentBlock = markup;

            // Enveloped block markups are those that are partially or
            // completely enveloped by the selection.

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