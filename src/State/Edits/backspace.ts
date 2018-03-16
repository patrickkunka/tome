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
        ).markup;

        if (blockAtIndex && blockAtIndex.isList && blockAtIndex.start === range.to) {
            // TODO: implement a linked list for this type of operation

            const precedingBlock = getMarkupOfTypeAtIndex(
                prevState.markups,
                MarkupType.BLOCK,
                blockAtIndex.start - HtmlEntity.BLOCK_BREAK.length
            ).markup;

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
        // If at the start of a block ingest previous two characters, else one

        const currentBlock = getMarkupOfTypeAtIndex(prevState.markups, MarkupType.BLOCK, range.from).markup;

        if (currentBlock && currentBlock.start === range.from) {
            fromIndex = range.from - 2;
        } else {
            fromIndex = range.from - 1;
        }
    }

    return insert(prevState, {from: fromIndex, to: range.to});
}

export default backspace;