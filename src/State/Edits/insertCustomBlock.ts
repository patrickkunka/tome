import HtmlEntity             from '../Constants/HtmlEntity';
import MarkupTag              from '../Constants/MarkupTag';
import MarkupType             from '../Constants/MarkupType';
import ICustomBlock           from '../Interfaces/ICustomBlock';
import Markup                 from '../Markup';
import State                  from '../State';
import TomeSelection          from '../TomeSelection';
import addTrailingParagraph   from '../Util/addTrailingParagraph';
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

    const markupLocatorAtIndex = getMarkupOfTypeAtIndex(
        nextState.markups,
        MarkupType.BLOCK,
        nextState.selection.from
    );

    const {
        markup: markupAtIndex,
        index: markupIndex
    } = markupLocatorAtIndex;

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

        replaceIndex = getNextMarkupOfType(nextState.markups, markup => markup.isBlock, markupIndex).index;
    } else {
        nextState = insert(
            nextState,
            nextState.selection,
            HtmlEntity.BLOCK_BREAK
        );

        if (markupAtIndex.end === selection.from) {
            // Selection at end of markup

            replaceIndex = getNextMarkupOfType(nextState.markups, markup => markup.isBlock, markupIndex).index;
        } else {
            // Selection at start of markup (markupAtIndex.start === selection.from)

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

    addTrailingParagraph(nextState);

    const nextBlockLocator = getNextMarkupOfType(nextState.markups, markup => markup.isBlock, replaceIndex);
    const nextBlockIndexOrEnd = nextBlockLocator.index > -1 ? nextBlockLocator.index : nextState.markups.length;
    const totalRedundantInlineMarkups = nextBlockIndexOrEnd - (replaceIndex + 1);

    if (totalRedundantInlineMarkups > 0) {
        // Remove any subsequent redundant inline markups

        nextState.markups.splice(replaceIndex + 1, totalRedundantInlineMarkups);
    }

    nextState.selection.from =
    nextState.selection.to   =
        nextBlockLocator.markup ?
            nextBlockLocator.markup.start :
            nextState.text.length;

    return nextState;
}

export default insertCustomBlock;