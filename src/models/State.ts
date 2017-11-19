import Range     from './Range';
import Markup    from './Markup';
import MarkupTag from '../constants/MarkupTag';

class State {
    text:                  string        = '';
    markups:               Array<Markup> = [];
    selection:             Range         = new Range();
    activeBlockMarkup:     Markup        = null
    activeInlineMarkups:   Array<Markup> = [];
    envelopedBlockMarkups: Array<Markup> = [];

    constructor() {
        Object.seal(this);
    }

    get length() {
        return this.text.length;
    }

    isTagActive(tag: MarkupTag) {
        for (let i = 0, markup: Markup; (markup = this.activeInlineMarkups[i]); i++) {
            if (markup[0] === tag) return true;
        }

        return false;
    }
}

export default State;