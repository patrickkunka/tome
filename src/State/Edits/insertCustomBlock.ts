import HtmlEntity             from '../Constants/HtmlEntity';
import MarkupTag              from '../Constants/MarkupTag';
import MarkupType             from '../Constants/MarkupType';
import ICustomBlock           from '../Interfaces/ICustomBlock';
import Markup                 from '../Markup';
import State                  from '../State';
import TomeSelection          from '../TomeSelection';
import getMarkupOfTypeAtIndex from '../Util/getMarkupOfTypeAtIndex';
import insert                 from './insert';

function insertCustomBlock(
    prevState: State,
    range: TomeSelection,
    customBlock: ICustomBlock
): State {
    let content = '';

    const nextState = insert(
        prevState,
        range
    );

    const {selection} = nextState;

    const markupAtIndex = getMarkupOfTypeAtIndex(
        nextState.markups,
        MarkupType.BLOCK,
        nextState.selection.from
    );

    if (!markupAtIndex) return nextState;

    if (
        markupAtIndex.end === selection.from &&
        markupAtIndex.start === selection.from
    ) {
        const replaceIndex = nextState.markups.indexOf(markupAtIndex);

        const newMarkup = new Markup([
            customBlock.type as MarkupTag,
            markupAtIndex.start,
            markupAtIndex.end,
            customBlock.data
        ]);

        nextState.markups[replaceIndex] = newMarkup;
    } else if (markupAtIndex.end === selection.from) {
        console.log('end of block');
    } else if (markupAtIndex.start === selection.from) {
        console.log('start of block');
    } else {
        console.log('within block');
    }

    return nextState;
}

export default insertCustomBlock;