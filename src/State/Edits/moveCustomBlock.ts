import IMoveCustomBlockData from '../Interfaces/IMoveCustomBlockData';
import State                from '../State';
import TomeSelection        from '../TomeSelection';
import insertCustomBlock    from './insertCustomBlock';
import removeCustomBlock    from './removeCustomBlock';

function moveCustomBlock(prevState: State, {markup, index, offset}: IMoveCustomBlockData) {
    const targetIndex = Math.max(Math.min(index + offset, prevState.markups.length - 1), 0);
    const targetMarkup = prevState.markups[targetIndex];

    if (offset < 0) {
        const range = new TomeSelection(targetMarkup.start, targetMarkup.start);

        return insertCustomBlock(removeCustomBlock(prevState, {markup}), range, {
            data: markup.data,
            type: markup.tag
        });
    } else if (offset > 0) {
        const range = new TomeSelection(targetMarkup.end, targetMarkup.end);

        return removeCustomBlock(insertCustomBlock(prevState, range, {
            data: markup.data,
            type: markup.tag
        }), {markup});
    }

    return prevState;
}

export default moveCustomBlock;