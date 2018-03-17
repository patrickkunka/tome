import HtmlEntity             from '../Constants/HtmlEntity';
import IRemoveCustomBlockData from '../Interfaces/IRemoveCustomBlockData';
import TomeSelection          from '../TomeSelection';
import insert                 from './insert';

function removeCustomBlock(prevState, {markup}: IRemoveCustomBlockData) {
    const blockBreakLength = HtmlEntity.BLOCK_BREAK.length;
    const textLength = prevState.text.length;

    let range: TomeSelection = null;

    if (markup.end < textLength) {
        range = new TomeSelection(markup.start, Math.min(markup.end + blockBreakLength, textLength));
    } else {
        range = new TomeSelection(Math.max(0, markup.start - blockBreakLength), markup.end);
    }

    return insert(prevState, range);
}

export default removeCustomBlock;