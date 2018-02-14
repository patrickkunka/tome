import HtmlEntity             from '../Constants/HtmlEntity';
import State                  from '../State';
import TomeSelection          from '../TomeSelection';
import insert                 from './insert';

function del(prevState: State, range: TomeSelection): State {
    let toIndex: number = range.to;

    // If at end, ignore

    if (range.from === prevState.text.length) return prevState;

    if (range.isCollapsed) {
        // If succeeding characer is a block break, ingest following two characers, else one

        const succeedingSample = prevState.text.slice(range.to, range.to + 2);

        toIndex = succeedingSample === HtmlEntity.BLOCK_BREAK ? range.to + 2 : range.to + 1;
    }

    return insert(prevState, {from: range.from, to: toIndex});
}

export default del;