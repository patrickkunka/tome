import HtmlEntity             from '../Constants/HtmlEntity';
import MarkupTag              from '../Constants/MarkupTag';
import MarkupType             from '../Constants/MarkupType';
import ICustomBlock           from '../Interfaces/ICustomBlock';
import Markup                 from '../Markup';
import State                  from '../State';
import TomeSelection          from '../TomeSelection';
import getMarkupOfTypeAtIndex from '../Util/getMarkupOfTypeAtIndex';
import getNextMarkupOfType    from '../Util/getNextMarkupOfType';
import insert                 from './insert';

function insertCustomBlock(
    prevState: State,
    range: TomeSelection,
    customBlock: ICustomBlock
): State {
    let nextState = prevState;
    let replaceIndex = 0;

    if (!range.isCollapsed) {
        nextState = insert(
            prevState,
            range
        );
    } else {
        nextState = Object.assign(new State(), prevState);
        nextState.markups = prevState.markups.slice();
        nextState.selection = range;
    }

    const {selection} = nextState;

    const markupAtIndex = getMarkupOfTypeAtIndex(
        nextState.markups,
        MarkupType.BLOCK,
        nextState.selection.from
    );

    if (!markupAtIndex) return nextState;

    const markupIndex = nextState.markups.indexOf(markupAtIndex);

    if (
        markupAtIndex.end === selection.from &&
        markupAtIndex.start === selection.from
    ) {
        // At empty block, replace with custom block

        replaceIndex = markupIndex;
    } else if (
        markupAtIndex.start < selection.from &&
        markupAtIndex.end > selection.from
    ) {
        // Within block, block break twice to create an empty
        // block and replace

        let i = 2;

        while (i--) {
            nextState = insert(
                nextState,
                nextState.selection,
                HtmlEntity.BLOCK_BREAK
            );
        }

        replaceIndex = getNextMarkupOfType(nextState.markups, MarkupType.BLOCK, markupIndex).index;
    } else {
        nextState = insert(
            nextState,
            nextState.selection,
            HtmlEntity.BLOCK_BREAK
        );

        if (markupAtIndex.end === selection.from) {
            // At end of markup

            replaceIndex = getNextMarkupOfType(nextState.markups, MarkupType.BLOCK, markupIndex).index;
        } else if (markupAtIndex.start === selection.from) {
            // At start of markup

            replaceIndex = markupIndex;
        }
    }

    const {start, end} = nextState.markups[replaceIndex];

    const newMarkup = new Markup([
        customBlock.type as MarkupTag,
        start,
        end,
        customBlock.data
    ]);

    nextState.markups[replaceIndex] = newMarkup;

    const nextBlockLocator = getNextMarkupOfType(nextState.markups, MarkupType.BLOCK, replaceIndex);

    if (nextBlockLocator) {
        nextState.selection.from = nextState.selection.to = nextBlockLocator.markup.start;
    } else {
        // TODO: set carat at safety break
    }

    return nextState;
}

export default insertCustomBlock;