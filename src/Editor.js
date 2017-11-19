import State        from './models/State';
import Markup       from './models/Markup';
import Util         from './Util';

import MarkupTag from './constants/MarkupTag';

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
     * @param {State}      prevState
     * @param {ISelection} range
     * @param {string}     content
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

        if (content === MarkupTag.LINE_BREAK) {
            nextState.markups = Editor.splitMarkups(nextState.markups, range.from);

            totalTrimmed = Editor.trimWhitespace(nextState, range.from);
        } else if (content === '') {
            nextState.markups = Editor.joinMarkups(nextState.markups, range.from);
            nextState.markups = Editor.joinMarkups(nextState.markups, range.to);
        }

        nextState.selection.from =
        nextState.selection.to   = range.from + totalAdded + totalTrimmed;

        Editor.setActiveMarkups(nextState, nextState.selection);

        return nextState;
    }

    static addInlineMarkup(prevState, tag, from, to, markup=null) {
        const nextState = Util.extend(new State(), prevState, true);
        const enveloped = prevState.envelopedBlockMarkups || [];

        let insertIndex  = -1;

        if (enveloped.length > 1) {
            let formattedState = nextState;

            // Split and delegate the command

            formattedState.envelopedBlockMarkups.length = 0;

            enveloped.forEach((markup, i) => {
                const formatFrom = i === 0 ? from : markup[1];
                const formatTo   = i === enveloped.length - 1 ? to : markup[2];

                formattedState = Editor.addInlineMarkup(formattedState, tag, formatFrom, formatTo, markup);
            });

            return formattedState;
        }

        // Single block markup

        markup = markup || enveloped[0];

        if (markup) {
            // ensure range does not extend over breaks
            // around markups

            from = from < markup[1] ? markup[1] : from;
            to = to > markup[2] ? markup[2] : to;
        }

        // Remove all existing inline markups of type within range

        Editor.ingestMarkups(nextState.markups, tag, from, to);

        for (let i = 0, len = nextState.markups.length; i < len; i++) {
            const markup = new Markup(nextState.markups[i]);

            // NB: When inserting an inline markup there should always be at
            // least one block markup in the array

            insertIndex = i;

            if (markup.start > from) {
                // Markup starts after markup to insert, insert at index

                break;
            } else if (i === len - 1) {
                // Last markup, insert after

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
        const enveloped = prevState.envelopedBlockMarkups || [];

        if (enveloped.length > 1) {
            let formattedState = nextState;

            // Split and delegate the command

            formattedState.envelopedBlockMarkups.length = 0;

            enveloped.forEach((markup, i) => {
                const formatFrom = i === 0 ? from : markup.start;
                const formatTo   = i === enveloped.length - 1 ? to : markup.end;

                formattedState = Editor.removeInlineMarkup(formattedState, tag, formatFrom, formatTo);
            });

            return formattedState;
        }

        Editor.ingestMarkups(nextState.markups, tag, from, to);

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
            const [, markupStart, markupEnd] = markup;
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
                } else if (!markup.isBlock || markupStart > fromIndex) {
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
                    const closingBlockMarkup = Editor.getClosingBlockMarkup(markups, i, toIndex);

                    // Extend block markup to end of closing block +/-
                    // adjustment

                    newMarkup[2] = closingBlockMarkup[2] + adjustment;
                }
            }

            if (!removeMarkup) {
                newMarkups.push(newMarkup);
            }
        }

        return newMarkups;
    }

    /**
     * Returns the closing block markup after the markup at the
     * provided index.
     *
     * @static
     * @param  {Array.<Markup>} markups
     * @param  {number} markupIndex
     * @param  {number} toIndex
     * @return {(Markup|null)}
     */

    static getClosingBlockMarkup(markups, markupIndex, toIndex) {
        for (let i = markupIndex + 1, markup; (markup = markups[i]); i++) {
            if (!(markup instanceof Markup)) {
                markup = new Markup(markup);
            }

            if (markup.isBlock && markup.start <= toIndex && markup.end >= toIndex) {
                return markup;
            }
        }

        return null;
    }

    /**
     * Trims leading/trailing whitespace from block elements
     * when a block is split.
     *
     * Returns the total adjustment made to the text before the split.
     *
     * @param  {State}  nextState
     * @param  {number} splitIndex
     * @return {number}
     */

    static trimWhitespace(nextState, splitIndex) {
        let totalAllTrimmed = 0;
        let caretAdjustment = 0;
        let trimmedIndex = -1;

        for (let i = 0; i < nextState.markups.length; i++) {
            const markupRaw = nextState.markups[i];

            if (totalAllTrimmed !== 0 && markupRaw[1] >= trimmedIndex) {
                // If previous adjustments have been made, adjust
                // subsequent markups' positions accordingly

                markupRaw[1] += totalAllTrimmed;
                markupRaw[2] += totalAllTrimmed;
            }

            const markup = new Markup(markupRaw);

            if (!markup.isBlock) continue;

            const before  = nextState.text.slice(0, markup.start);
            const content = nextState.text.slice(markup.start, markup.end);
            const after   = nextState.text.slice(markup.end);

            let trimmed = content;

            // Trim whitespace from start and end of blocks

            if (trimmed.charAt(0) === ' ') {
                trimmedIndex = markup.start;

                trimmed = trimmed.slice(1);
            }

            if (trimmed.charAt(trimmed.length - 1) === ' ') {
                trimmedIndex = markup.end - 1;

                trimmed = trimmed.slice(0, -1);
            }

            const totalTrimmed = trimmed.length - content.length;

            if (totalTrimmed === 0) continue;

            totalAllTrimmed += totalTrimmed;

            if (markup.start < splitIndex) {
                // If the affected markup starts before the split index,
                // increase the total

                caretAdjustment += totalTrimmed;
            }

            // Reduce markup end by trimmed amount

            markupRaw[2] += totalTrimmed;

            // Rebuild text

            nextState.text = before + trimmed + after;
        }

        return caretAdjustment;
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
        for (let i = 0; i < markups.length; i++) {
            const markupRaw = markups[i];
            const markup = new Markup(markupRaw);

            let newMarkup = null;

            if (markup.start < index && markup.end > index) {
                const newStartIndex = index + 1;
                const newTag = markup.isBlock && markup.end === newStartIndex ? MarkupTag.P : markup.tag;

                let j = i + 1;
                let insertIndex = -1;

                markupRaw[2] = index;

                newMarkup = new Markup([newTag, newStartIndex, markup.end]);

                for (; j < markups.length; j++) {
                    const markup = new Markup(markups[j]);

                    if (markup.start === newStartIndex) {
                        insertIndex = newMarkup.isBlock ? j : j + 1;

                        break;
                    } else if (markup.start > newStartIndex) {
                        insertIndex = j;

                        break;
                    }
                }

                markups.splice(insertIndex, 0, newMarkup);

                if (insertIndex === j) {
                    i = insertIndex;
                }
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

        // TODO: use quick search to find start index

        let closingBlock = null;

        for (let i = 0; i < markups.length; i++) {
            const markup = new Markup(markups[i]);

            if (markup.end === index) {
                if (markup.isBlock) {
                    // Block markup closes at index

                    closingBlock = markups[i];
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
                    // Markup should be extended

                    extend[2] = markup[2];

                    markups.splice(i, 1);

                    i--;
                }
            } else if (markup.start > index) {
                // Passed joining index, done

                break;
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
            } else if (markupStart < from && markupEnd >= to) {
                // Markup overlaps start, shorten by moving end to
                // start of selection

                if (markupEnd > to) {
                    // Split markup into two

                    const newMarkup = [markupTag, to, markupEnd];

                    markups.splice(i + 1, 0, newMarkup);

                    i++;
                }

                markup[2] = from;
            } else if (markupStart > from && markupStart < to) {
                // Markup overlaps end, shorten by moving start to
                // end of selection

                markup[1] = to;
            } else if (markupStart === from && markupEnd > to) {
                // Markup envelops range from start

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
     * @param  {EditorRange} range
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
                // overlapping end

                (range.from >= markup.start && range.from < markup.end) ||

                // overlapping start

                (range.to > markup.start && range.to <= markup.end) ||

                // enveloped

                (range.from <= markup.start && range.to >= markup.end)
            ) {
                state.envelopedBlockMarkups.push(markup);
            }
        }
    }
}

export default Editor;