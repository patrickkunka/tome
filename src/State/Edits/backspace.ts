import HtmlEntity             from '../Constants/HtmlEntity';
import MarkupTag              from '../Constants/MarkupTag';
import MarkupType             from '../Constants/MarkupType';
import State                  from '../State';
import TomeSelection          from '../TomeSelection';
import getMarkupOfTypeAtIndex from '../Util/getMarkupOfTypeAtIndex';
import sanitizeLists          from '../Util/sanitizeLists';
import changeBlockType        from './changeBlockType';
import insert                 from './insert';

function backspace(prevState: State, range: TomeSelection): State {
    let fromIndex: number = range.from;

    if (range.isCollapsed) {
        // If at the start of a list and the previous element is
        // not another list item, convert the first list item to a <p>

        const blockAtIndex = getMarkupOfTypeAtIndex(
            prevState.markups,
            MarkupType.BLOCK,
            range.to
        );

        if (blockAtIndex && blockAtIndex.isList && blockAtIndex.start === range.to) {
            // TODO: implement a linked list for this type of operation

            const precedingBlock = getMarkupOfTypeAtIndex(
                prevState.markups,
                MarkupType.BLOCK,
                blockAtIndex.start - HtmlEntity.BLOCK_BREAK.length
            );

            if (!precedingBlock || !precedingBlock.isList) {
                const nextState = changeBlockType(prevState, MarkupTag.P);

                sanitizeLists(nextState.markups);

                return nextState;
            }
        }
    }

    // If at start, ignore

    if (range.to === 0) {
        return prevState;
    }

    if (range.isCollapsed) {
        // If previous character is a block break, ingest previous two characters, else one

        const precedingSample = prevState.text.slice(range.from - 2, range.from);

        fromIndex = precedingSample === HtmlEntity.BLOCK_BREAK ? range.from - 2 : range.from - 1;
    }

    return insert(prevState, {from: fromIndex, to: range.to});
}

export default backspace;