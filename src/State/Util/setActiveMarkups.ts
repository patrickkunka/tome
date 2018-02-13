import ISelection    from '../interfaces/ISelection';
import Markup        from '../Markup';
import MarkupsMap    from '../MarkupsMap';
import State         from '../State';

/**
 * Determines which block and inline markups should be "active"
 * or "enveloped" for a particular selection.
 */

function setActiveMarkups(state: State, selection: ISelection): void {
    const activeInlineMarkups = new MarkupsMap();

    state.activeInlineMarkups.clearAll();

    let parentBlock: Markup = null;

    state.activeBlockMarkup = state.activeListMarkup = null;

    state.envelopedBlockMarkups.length = 0;

    for (const markup of state.markups) {
        const lastConsecutive = activeInlineMarkups.lastOfTag(markup.tag);

        // An active block markup is one that surrounds the start of the selection.

        // Active inline markups are those that surround or match the the
        // selection and should therefore be activated in any UI

        if (markup.start <= selection.from && markup.end >= selection.from) {
            if (markup.isList) {
                state.activeListMarkup = markup;
            } else if (markup.isBlock || markup.isListItem) {
                // Only one (non-list) block markup may be active at a time
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

        if (markup.isInline || markup.isList) continue;

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

export default setActiveMarkups;