import MarkupTag  from '../Constants/MarkupTag';
import ISelection from '../interfaces/ISelection';
import Markup     from '../Markup';

function parseClipboardToMarkups(plainText: string): Markup[] {
    const expBlockBreak = /\n\n/g;
    const expLineBreak  = /(^|[^\n])\n($|[^\n])/g;

    const blockBreaks: ISelection[] = [];
    const lineBreaks:  ISelection[] = [];
    const markups:     Markup[]     = [];

    let match: RegExpExecArray;

    while (match = expBlockBreak.exec(plainText)) {
        const from = match.index;
        const to   = from + match[0].length;

        blockBreaks.push({from, to});

        plainText = plainText.slice(0, from) + '__' + plainText.slice(to);
    }

    while (match = expLineBreak.exec(plainText)) {
        const from = match.index + 1;
        const to   = from;

        lineBreaks.push({from, to});
    }

    if (blockBreaks.length < 1) {
        markups.push(new Markup([MarkupTag.P, 0, plainText.length]));
    }

    for (let i = 0; i < blockBreaks.length; i++) {
        const blockBreak = blockBreaks[i];
        const closeAt = i === blockBreaks.length - 1 ? plainText.length : NaN;

        const lastBlock = markups.length > 0 ?
            markups[markups.length - 1] : new Markup([MarkupTag.P, 0, blockBreak.from]);

        if (i === 0) {
            markups.push(lastBlock);
        }

        lastBlock[2] = blockBreak.from;

        markups.push(new Markup([MarkupTag.P, blockBreak.to, closeAt]));
    }

    let lastInsertionIndex = 0;

    for (const lineBreak of lineBreaks) {
        const lineBreakMarkup = new Markup([MarkupTag.BR, lineBreak.from, lineBreak.to]);

        // loop through markups from last insertion index until we find one that
        // starts after line break, insert line break before, and cache insertion
        // index

        for (let j = lastInsertionIndex; j < markups.length; j++) {
            const markup = markups[j];

            if (markup.isBlock && markup.start > lineBreak.from) {
                // Markup starts after line break

                markups.splice(j, 0, lineBreakMarkup);

                lastInsertionIndex = j;

                break;
            } else if (j === markups.length - 1) {
                // At end

                markups.push(lineBreakMarkup);

                break;
            }
        }
    }

    return markups;
}

export default parseClipboardToMarkups;