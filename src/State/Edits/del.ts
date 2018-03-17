import MarkupType             from '../Constants/MarkupType';
import State                  from '../State';
import TomeSelection          from '../TomeSelection';
import getMarkupOfTypeAtIndex from '../Util/getMarkupOfTypeAtIndex';
import insert                 from './insert';

function del(prevState: State, range: TomeSelection): State {
    let toIndex: number = range.to;

    // If at end, ignore

    if (range.from === prevState.text.length) return prevState;

    if (range.isCollapsed) {
        // If at the end of a block ingest previous two characters, else one

        const currentBlock = getMarkupOfTypeAtIndex(prevState.markups, MarkupType.BLOCK, range.from).markup;

        if (currentBlock && currentBlock.end === range.from) {
            toIndex = range.from + 2;
        } else {
            toIndex = range.from + 1;
        }
    }

    return insert(prevState, {from: range.from, to: toIndex});
}

export default del;