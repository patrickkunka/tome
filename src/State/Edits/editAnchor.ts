import IAnchorData from '../../Dom/Interfaces/IAnchorData';
import MarkupTag   from '../Constants/MarkupTag';
import State       from '../State';
import cloneMarkup from '../Util/cloneMarkup';

function editAnchor(prevState: State, data: IAnchorData) {
    const nextState = Object.assign(new State(), prevState);

    nextState.markups = prevState.markups.slice();

    const anchor = nextState.activeInlineMarkups.allOfTag(MarkupTag.A)[0];
    const index = nextState.markups.indexOf(anchor);
    const newAnchor = cloneMarkup(anchor);

    newAnchor[3] = data;

    nextState.markups[index] = newAnchor;

    return nextState;
}

export default editAnchor;