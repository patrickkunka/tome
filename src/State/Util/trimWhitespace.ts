import Markup from '../Markup';
import State  from '../State';

/**
 * Trims leading/trailing whitespace from block elements
 * when a block is split.
 *
 * Returns the total adjustment made to the text before the split.
 */

function trimWhitespace(nextState: State, splitIndex: number): number {
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

export default trimWhitespace;