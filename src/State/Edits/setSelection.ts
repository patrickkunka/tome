import HtmlEntity             from '../Constants/HtmlEntity';
import MarkupType             from '../Constants/MarkupType';
import ISelection             from '../interfaces/ISelection';
import State                  from '../State';
import TomeSelection          from '../TomeSelection';
import getMarkupOfTypeAtIndex from '../Util/getMarkupOfTypeAtIndex';
import setActiveMarkups       from '../Util/setActiveMarkups';

/**
 * Updates the selection in response to caret movement.
 */

function setSelection(prevState: State, range: ISelection): State {
    const nextState = Object.assign(new State(), prevState);
    const markupAtIndex = getMarkupOfTypeAtIndex(prevState.markups, MarkupType.CUSTOM_BLOCK, range.from);

    nextState.selection = new TomeSelection();

    nextState.markups = prevState.markups.slice();

    if (markupAtIndex) {
        const prevMarkupEnd = markupAtIndex.start - HtmlEntity.BLOCK_BREAK.length;

        Object.assign(nextState.selection, {from: prevMarkupEnd, to: prevMarkupEnd});
    } else {
        Object.assign(nextState.selection, range);
    }

    setActiveMarkups(nextState, range);

    nextState.activeInlineMarkups.overrides.length = 0;

    return nextState;
}

export default setSelection;