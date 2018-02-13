import HtmlEntity             from '../Constants/HtmlEntity';
import ISelection             from '../interfaces/ISelection';
import State                  from '../State';
import insert                 from './insert';

const expSinglePreceedingNewLine = /(\S|^)\n$/;
const expSingleSubsequentNewLine = /^\n(\S|$)/;

function insertLineBreak(prevState: State, range: ISelection): State {
    // detect if inserting a line break directly before or
    // after an existing line break

    const precedingSample = prevState.text.slice(range.from - 2, range.from);

    if (precedingSample.match(expSinglePreceedingNewLine)) {
        // Matches single preceeding newline

        return insert(
            prevState,
            {from: range.from - 1, to: range.to},
            HtmlEntity.BLOCK_BREAK
        );
    }

    const succeedingSample = prevState.text.slice(range.to, range.to + 2);

    if (succeedingSample.match(expSingleSubsequentNewLine)) {
        // Matches single succeeding newline character

        return insert(
            prevState,
            {from: range.from, to: range.to + 1},
            HtmlEntity.BLOCK_BREAK
        );
    }

    return insert(prevState, range, HtmlEntity.LINE_BREAK);
}

export default insertLineBreak;