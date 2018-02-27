import HtmlEntity             from '../Constants/HtmlEntity';
import MarkupTag              from '../Constants/MarkupTag';
import State                  from '../State';
import TomeSelection          from '../TomeSelection';
import insert                 from './insert';

function insertCustomBlock(
    prevState: State,
    range: TomeSelection
): State {
    return insert(prevState, range, HtmlEntity.BLOCK_BREAK, false, MarkupTag.DIV);
}

export default insertCustomBlock;