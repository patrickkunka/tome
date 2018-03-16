import HtmlEntity from '../Constants/HtmlEntity';
import MarkupTag  from '../Constants/MarkupTag';
import Markup     from '../Markup';
import State      from '../State';

/**
 * Adds an empty paragraph block to the end of the editor if the final block
 * is a custom block.
 */

function addTrailingParagraph(nextState: State): void {
    if (nextState.markups.length < 1 || !nextState.markups[nextState.markups.length - 1].isCustomBlock) return;

    nextState.text += HtmlEntity.BLOCK_BREAK;

    const lastIndex = nextState.text.length;

    nextState.markups.push(new Markup([MarkupTag.P, lastIndex, lastIndex]));
}

export default addTrailingParagraph;