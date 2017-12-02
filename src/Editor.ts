import HtmlEntity     from './constants/HtmlEntity';
import MarkupTag      from './constants/MarkupTag';
import IClipboardData from './interfaces/IClipboardData';
import ISelection     from './interfaces/ISelection';
import Markup         from './models/Markup';
import MarkupsMap     from './models/MarkupsMap';
import State          from './models/State';
import TomeSelection  from './models/TomeSelection';
import Util           from './Util';

/**
 * A static class of utility functions for performing edits to
 * the editor state.
 */

class Editor {
    /**
     * Inserts zero or more characters into a range, deleting
     * the contents of the range. Adjusts all markups affected by
     * insertion.
     */

    public static insert(prevState: State, range: ISelection, content: string): State {

        const totalDeleted = range.to - range.from;

        const before       = prevState.text.slice(0, range.from);
        const after        = prevState.text.slice(range.to);
        const totalAdded   = content.length;
        const adjustment   = totalAdded - totalDeleted;
        const totalTrimmed = 0;

        let nextState = new State();

        nextState.text = before + content + after;

        nextState.markups = Editor.adjustMarkups(
            prevState.markups,
            range.from,
            range.to,
            totalAdded,
            adjustment
        );

        if (content === HtmlEntity.BLOCK_BREAK) {
            nextState.markups = Editor.splitMarkups(nextState.markups, range.from);

            // TODO: make whitespace trimming available via config

            // totalTrimmed = Editor.trimWhitespace(nextState, range.from);
        } else if (content === HtmlEntity.LINE_BREAK) {
            nextState = Editor.addInlineMarkup(nextState, MarkupTag.BR, range.from, range.from);
        } else if (content === '') {
            nextState.markups = Editor.joinMarkups(nextState.markups, range.from);
            nextState.markups = Editor.joinMarkups(nextState.markups, range.to);
        }

        nextState.selection.from =
        nextState.selection.to   = range.from + totalAdded + totalTrimmed;

        Editor.setActiveMarkups(nextState, nextState.selection);

        return nextState;
    }

    public static addInlineMarkup(
        prevState: State,
        tag: MarkupTag,
        from: number,
        to: number,
        data: any = null,
        markup: Markup = null
    ): State {
        const nextState: State = Util.extend(new State(), prevState, true);
        const enveloped = prevState.envelopedBlockMarkups || [];

        nextState.markups = prevState.markups.map(prevMarkup => new Markup(prevMarkup.toArray()));

        let insertIndex = -1;

        if (enveloped.length > 1) {
            let formattedState = nextState;

            // Split and delegate the command

            formattedState.envelopedBlockMarkups.length = 0;

            enveloped.forEach((envelopedBlockMarkup, i) => {
                const formatFrom = i === 0 ? from : envelopedBlockMarkup.start;
                const formatTo   = i === enveloped.length - 1 ? to : envelopedBlockMarkup.end;

                formattedState = Editor.addInlineMarkup(
                    formattedState,
                    tag,
                    formatFrom,
                    formatTo,
                    data,
                    envelopedBlockMarkup
                );
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
            const nextMarkup = nextState.markups[i];

            // NB: When inserting an inline markup there should always be at
            // least one block markup in the array

            insertIndex = i;

            if (nextMarkup.start > from) {
                // Markup starts after markup to insert, insert at index

                break;
            } else if (i === len - 1) {
                // Last markup, insert after

                insertIndex++;

                break;
            }
        }

        let newMarkup: Markup;

        if (data) {
            newMarkup = new Markup([tag, from, to, data]);
        } else {
            newMarkup = new Markup([tag, from, to]);
        }

        nextState.markups.splice(insertIndex, 0, newMarkup);

        Editor.joinMarkups(nextState.markups, from);
        Editor.joinMarkups(nextState.markups, to);

        return nextState;
    }

    public static removeInlineMarkup(prevState: State, tag: MarkupTag, from: number, to: number): State {
        const nextState = Util.extend(new State(), prevState, true);
        const enveloped = prevState.envelopedBlockMarkups || [];

        nextState.markups = prevState.markups.map(markup => new Markup(markup.toArray()));

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

    /**
     * Changes the currently active block markup to the provided tag.
     */

    public static changeBlockType(prevState: State, tag: MarkupTag): State {
        const nextState = Util.extend(new State(), prevState, true);

        // TODO: add configuration option to strip inline markups from non
        // paragraph blocks

        nextState.markups = prevState.markups.map(prevMarkup => {
            const nextMarkup = new Markup(prevMarkup.toArray());

            if (prevState.envelopedBlockMarkups.indexOf(prevMarkup) > -1) {
                nextMarkup[0] = tag;
            }

            return nextMarkup;
        });

        return nextState;
    }

    /**
     * Adjusts the position/length of existing markups in
     * response to characters being added/removed.
     */

    public static adjustMarkups(
        markups:    Markup[],
        fromIndex:  number,
        toIndex:    number,
        totalAdded: number,
        adjustment: number
    ): Markup[] {
        const newMarkups: Markup[] = [];
        const toRemove: Markup[] = [];
        const isCollapsedRange = fromIndex === toIndex;

        for (let i = 0, markup: Markup; (markup = markups[i]); i++) {
            const newMarkup = new Markup(markup.toArray());

            let removeMarkup = false;

            if (toRemove.length > 0 && toRemove.indexOf(markup) > -1) {
                // Markup to be removed as was consumed by a previous block markup

                removeMarkup = true;
            } else if (markup.start >= fromIndex && markup.end <= toIndex) {
                // Selection completely envelopes markup

                if (!isCollapsedRange && markup.isSelfClosing && markup.start === fromIndex) {
                    removeMarkup = true;
                } else if (markup.start === fromIndex && (markup.isBlock || markup.isInline && totalAdded > 0)) {
                    // Markup should be preserved is a) is block element,
                    // b) is inline and inserting

                    newMarkup[2] = markup.start + totalAdded;

                    if (markup.isSelfClosing) newMarkup[1] = newMarkup.end;
                } else if (markup.isSelfClosing && markup.start === toIndex) {
                    newMarkup[1] = newMarkup[2] = markup.start + adjustment;
                } else if (!markup.isBlock || markup.start > fromIndex) {
                    removeMarkup = true;
                }
            } else if (markup.start <= fromIndex && markup.end >= toIndex) {
                // Selection within markup or equal to markup

                newMarkup[2] += adjustment;

                if (markup.isInline && (markup.start === fromIndex && fromIndex === toIndex)) {
                    // Collapsed caret at start of inline markup

                    newMarkup[1] += adjustment;
                }
            } else if (markup.start >= toIndex) {
                // Markup starts after Selection

                newMarkup[1] += adjustment;
                newMarkup[2] += adjustment;
            } else if (fromIndex < markup.start && toIndex > markup.start && toIndex < markup.end && markup.isInline) {
                // Selection partially envelopes inline markup from start

                newMarkup[1] += (adjustment + (toIndex - markup.start));
                newMarkup[2] += adjustment;
            } else if (fromIndex > markup.start && fromIndex <= markup.end && toIndex > markup.end) {
                // Selection partially envelopes markup from end, or is at end

                if (markup.isInline) {
                    // Extend inline markup to end of insertion

                    newMarkup[2] = fromIndex + totalAdded;
                } else {
                    const closingBlockMarkup = Editor.getClosingBlockMarkup(markups, i, toIndex);

                    // Extend block markup to end of closing block +/-
                    // adjustment, closing markup will be removed in
                    // subsequent iteration

                    newMarkup[2] = closingBlockMarkup.end + adjustment;

                    toRemove.push(closingBlockMarkup);
                }
            }

            // If an inline markup has collapsed, remove it

            if (newMarkup[1] === newMarkup[2] && newMarkup.isInline && !newMarkup.isSelfClosing) removeMarkup = true;

            if (!removeMarkup) {
                newMarkups.push(newMarkup);
            }
        }

        return newMarkups;
    }

    /**
     * Returns the closing block markup after the markup at the
     * provided index.
     */

    public static getClosingBlockMarkup(markups: Markup[], markupIndex: number, toIndex: number): Markup {
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
     */

    public static trimWhitespace(nextState: State, splitIndex: number): number {
        let totalAllTrimmed = 0;
        let caretAdjustment = 0;
        let trimmedIndex    = -1;

        for (const markupRaw of nextState.markups) {
            if (totalAllTrimmed !== 0 && markupRaw[1] >= trimmedIndex) {
                // If previous adjustments have been made, adjust
                // subsequent markups' positions accordingly

                markupRaw[1] += totalAllTrimmed;
                markupRaw[2] += totalAllTrimmed;
            }

            const markup = new Markup(markupRaw.toArray());

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
     * of a block break.
     */

    public static splitMarkups(markups: Markup[], splitIndex: number): Markup[] {
        for (let i = 0; i < markups.length; i++) {
            const markup = markups[i];
            const originalMarkupEnd = markup.end;

            let newMarkup = null;

            if (markup.start <= splitIndex && markup.end > splitIndex) {
                const newStartIndex = splitIndex + HtmlEntity.BLOCK_BREAK.length;
                const newTag = markup.isBlock && markup.end === newStartIndex ? MarkupTag.P : markup.tag;

                let j = i + 1;
                let insertIndex = -1;

                // Contract markup

                markup[2] = splitIndex;

                if (markup.isInline && markup[1] === markup[2]) {
                    // Markup has contracted into non-existence

                    markups.splice(i, 1);

                    i--;

                    continue;
                }

                newMarkup = new Markup([newTag, newStartIndex, originalMarkupEnd]);

                // Find appropriate insertion index

                for (; j < markups.length; j++) {
                    const siblingMarkup = markups[j];

                    if (siblingMarkup.start === newStartIndex) {
                        insertIndex = newMarkup.isBlock ? j : j + 1;

                        break;
                    } else if (siblingMarkup.start > newStartIndex) {
                        insertIndex = j;

                        break;
                    }
                }

                if (insertIndex < 0) {
                    // If no insert index found, insert at end

                    insertIndex = j;
                }

                markups.splice(insertIndex, 0, newMarkup);
            }
        }

        return markups;
    }

    /**
     * Joins two adjacent markups at a provided (known) index.
     */

    public static joinMarkups(markups: Markup[], index: number): Markup[] {
        const closingInlines = {};

        // TODO: use quick search to find start index

        let closingBlock = null;

        for (let i = 0; i < markups.length; i++) {
            const markup = new Markup(markups[i].toArray());

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
     */

    public static ingestMarkups(markups: Markup[], tag: MarkupTag, from: number, to: number): void {
        for (let i = 0, markup; (markup = markups[i]); i++) {
            if (markup.tag !== tag) continue;

            if (markup.start >= from && markup.end <= to) {
                // Markup enveloped, remove

                markups.splice(i, 1);

                i--;
            } else if (markup.start < from && markup.end >= to) {
                // Markup overlaps start, shorten by moving end to
                // start of selection

                if (markup.end > to) {
                    let newMarkup: Markup;

                    // Split markup into two

                    if (markup.data !== null) {
                        newMarkup = new Markup([markup.tag, to, markup.end, markup.data]);
                    } else {
                        newMarkup = new Markup([markup.tag, to, markup.end]);
                    }

                    markups.splice(i + 1, 0, newMarkup);

                    i++;
                }

                markup[2] = from;
            } else if (markup.start > from && markup.start < to) {
                // Markup overlaps end, shorten by moving start to
                // end of selection

                markup[1] = to;
            } else if (markup.start === from && markup.end > to) {
                // Markup envelops range from start

                markup[1] = to;
            }
        }
    }

    /**
     * Determines which block and inline markups should be "active"
     * or "enveloped" for a particular selection.
     */

    public static setActiveMarkups(state: State, selection: TomeSelection): void {
        const activeInlineMarkups = new MarkupsMap();

        state.activeInlineMarkups.clearAll();

        let parentBlock: Markup = null;

        state.activeBlockMarkup = null;

        state.envelopedBlockMarkups.length = 0;

        for (const markup of state.markups) {
            const lastConsecutive = activeInlineMarkups.lastOfTag(markup.tag);

            // An active block markup is one that surrounds the start of the selection.

            // Active inline markups are those that surround or match the the
            // selection and should therefore be activated in any UI

            if (markup.start <= selection.from && markup.end >= selection.from) {
                if (markup.isBlock) {
                    // Only one block markup may be active at a time
                    // (the first one)

                    state.activeBlockMarkup = markup;
                } else if (markup.end >= selection.to) {
                    // Simple enveloped inline markup

                    state.activeInlineMarkups.add(markup);
                } else if (markup.end === parentBlock.end) {
                    // Potential first consectutive inline markup

                    activeInlineMarkups.add(markup);

                    continue;
                }
            }

            if (
                lastConsecutive &&
                (
                    markup.start === parentBlock.start && markup.end >= selection.to ||
                    markup.start === parentBlock.start && markup.end === parentBlock.end
                )
            ) {
                // Continuation or end of an adjacent inline markup

                activeInlineMarkups.add(markup);

                if (selection.to <= markup.end) {
                    // Final adjacent inline markup, move all to state then clear

                    state.activeInlineMarkups.add(...activeInlineMarkups.allOfTag(markup.tag));

                    activeInlineMarkups.clearTag(markup.tag);
                }
            } else if (markup.isInline) {
                // Doesn't match tag, or not a continuation, reset

                activeInlineMarkups.clearTag(markup.tag);
            }

            if (!markup.isBlock) continue;

            parentBlock = markup;

            // Enveloped block markups are those that are partially or
            // completely enveloped by the selection.

            if (
                // overlapping end

                (selection.from >= markup.start && selection.from < markup.end) ||

                // overlapping start

                (selection.to > markup.start && selection.to <= markup.end) ||

                // enveloped

                (selection.from <= markup.start && selection.to >= markup.end)
            ) {
                state.envelopedBlockMarkups.push(markup);
            }
        }
    }

    public static insertFromClipboard(
        prevState: State,
        clipboardData: IClipboardData,
        from: number,
        to: number
    ): State {
        const expBlockBreak = /\n\n/g;
        const expLineBreak  = /(^|[^\n])\n($|[^\n])/g;

        const blockBreaks: ISelection[] = [];
        const lineBreaks:  ISelection[] = [];
        const markups:     Markup[]     = [];

        let match: RegExpExecArray;
        let plainText = clipboardData.text;

        while (match = expBlockBreak.exec(plainText)) {
            const from = match.index;
            const to   = from + match[0].length;

            blockBreaks.push({from, to});

            plainText = plainText.slice(0, from) + '__' + plainText.slice(to);
        }

        while (match = expLineBreak.exec(plainText)) {
            const from = match.index + 1;
            const to   = from + 1;

            lineBreaks.push({from, to});
        }


        if (blockBreaks.length < 1) {
            markups.push(new Markup([MarkupTag.P, 0, plainText.length]));
        }

        for (let i = 0; i < blockBreaks.length; i++) {
            const blockBreak = blockBreaks[i];
            const lastBlock  = markups.length > 0 ? markups[markups.length - 1] : new Markup([MarkupTag.P, 0, blockBreak.from]);
            const closeAt    = i === blockBreaks.length - 1 ? plainText.length : NaN;

            if (i === 0) {
                markups.push(lastBlock);
            }

            lastBlock[2] = blockBreak.from;

            markups.push(new Markup([MarkupTag.P, blockBreak.to, closeAt]));
        }

        console.log(clipboardData.text, markups);

        const output = clipboardData.text.replace(/\n/g, ' ');

        return Editor.insert(prevState, {from, to}, output);
    }
}

export default Editor;