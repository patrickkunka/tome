import MarkupType             from '../Constants/MarkupType';
import ISelection             from '../interfaces/ISelection';
import State                  from '../State';
import TomeSelection          from '../TomeSelection';
import getMarkupOfTypeAtIndex from '../Util/getMarkupOfTypeAtIndex';
import getNextMarkupOfType    from '../Util/getNextMarkupOfType';
import setActiveMarkups       from '../Util/setActiveMarkups';

/**
 * Updates the selection in response to caret movement.
 */

function setSelection(prevState: State, range: ISelection): State {
    const nextState = Object.assign(new State(), prevState);
    const markupLocatorAtIndex = getMarkupOfTypeAtIndex(prevState.markups, MarkupType.CUSTOM_BLOCK, range.from);

    nextState.selection = new TomeSelection();

    nextState.markups = prevState.markups.slice();

    if (markupLocatorAtIndex.markup) {
        const nextBlock = getNextMarkupOfType(
            nextState.markups,
            markup => markup.type === MarkupType.BLOCK,
            markupLocatorAtIndex.index
        ).markup;

        Object.assign(nextState.selection, {from: nextBlock.start, to: nextBlock.start});
    } else {
        Object.assign(nextState.selection, range);
    }

    setActiveMarkups(nextState, range);

    nextState.activeInlineMarkups.overrides.length = 0;

    return nextState;
}

export default setSelection;