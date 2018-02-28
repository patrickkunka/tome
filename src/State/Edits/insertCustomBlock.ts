import HtmlEntity             from '../Constants/HtmlEntity';
import ICustomBlock           from '../Interfaces/ICustomBlock';
import State                  from '../State';
import TomeSelection          from '../TomeSelection';
import insert                 from './insert';

function insertCustomBlock(
    prevState: State,
    range: TomeSelection,
    customBlock: ICustomBlock
): State {
    return insert(prevState, range, HtmlEntity.BLOCK_BREAK, false, customBlock);
}

export default insertCustomBlock;