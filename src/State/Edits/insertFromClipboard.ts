import IClipboardData          from '../Interfaces/IClipboardData';
import Markup                  from '../Markup';
import State                   from '../State';
import TomeSelection           from '../TomeSelection';
import parseClipboardToMarkups from '../Util/parseClipboardToMarkups';
import setActiveMarkups        from '../Util/setActiveMarkups';
import addInlineMarkup         from './addInlineMarkup';
import insert                  from './insert';
import removeInlineMarkup      from './removeInlineMarkup';

function insertFromClipboard(
    prevState: State,
    clipboardData: IClipboardData,
    from: number,
    to: number
): State {
    const clipboardMarkups: Markup[] = parseClipboardToMarkups(clipboardData.text).map(markup => {
        // Increment markup indices by `from` offset

        markup[1] += from;
        markup[2] += from;

        return markup;
    });

    const inlineMarkups: Markup[] = [];

    let nextState: State = insert(prevState, {from, to}, clipboardData.text, true);

    // iterate through next state markups, which will have been adjusted for the insertion.
    // once we arrive at the block markup containing the `from` index, insert new clipboard
    // markups

    for (let i = 0; i < nextState.markups.length; i++) {
        const markup = nextState.markups[i];

        let hasInsertedClipboardMarkups = false;

        if (!markup.isBlock) continue;

        if (markup.start <= from && markup.end >= from) {
            const clipboardBlocks: Markup[] = clipboardMarkups.filter(clipboardMarkup => clipboardMarkup.isBlock);

            // Extract all inline markups within enveloping markup

            for (let j = i; j < nextState.markups.length; j++) {
                let inlineMarkup;

                if ((inlineMarkup = nextState.markups[j]).isInline && inlineMarkup.end <= markup.end) {
                    inlineMarkups.push(inlineMarkup);

                    nextState.markups.splice(j, 1);

                    j--;
                }
            }

            const firstClipboardBlock = clipboardBlocks[0];
            const lastClipboardBlock = clipboardBlocks[clipboardBlocks.length - 1];

            // Extend first clipboard markup back to start of enveloping markup
            // Extend last clipboard markup up to end of enveloping markup

            firstClipboardBlock[1] = markup.start;
            lastClipboardBlock[2] = markup.end;

            // Remove enveloping and replace with clipboard markups

            nextState.markups.splice(i, 1, ...clipboardMarkups);

            hasInsertedClipboardMarkups = true;
        }

         // Re-insert inline markups as appropriate

        let insertionIndex = i + 1;

        while (hasInsertedClipboardMarkups && inlineMarkups.length > 0) {
            const inlineMarkup = inlineMarkups.shift();

            if (inlineMarkup.start >= markup.start && inlineMarkup.end <= markup.end) {
                // inline markup falls within block markup

                nextState.markups.splice(insertionIndex, 0, inlineMarkup);

                insertionIndex++;
            }
        }

        if (hasInsertedClipboardMarkups && inlineMarkups.length < 1) {
            break;
        }
    }

    if (prevState.activeInlineMarkups.overrides.length > 0) {
        const clipboardEndsAt = from + clipboardData.text.length;

        setActiveMarkups(nextState, new TomeSelection(from, clipboardEndsAt));

        for (const tag of prevState.activeInlineMarkups.overrides) {
            if (prevState.isTagActive(tag)) {
                // Override inline markup off

                nextState = removeInlineMarkup(nextState, tag, from, clipboardEndsAt);
            } else {
                // Override inline markup on

                nextState = addInlineMarkup(nextState, tag, from, clipboardEndsAt);
            }
        }

        setActiveMarkups(nextState, new TomeSelection(clipboardEndsAt, clipboardEndsAt));
    }

    return nextState;
}

export default insertFromClipboard;