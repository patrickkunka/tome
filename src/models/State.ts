import MarkupTag     from '../constants/MarkupTag';
import Markup        from './Markup';
import TomeSelection from './TomeSelection';

class State {
    public text:                  string        = '';
    public markups:               Markup[]      = [];
    public selection:             TomeSelection = new TomeSelection();
    public activeBlockMarkup:     Markup        = null;
    public activeInlineMarkups:   Markup[]      = [];
    public envelopedBlockMarkups: Markup[]      = [];

    constructor() {
        Object.seal(this);
    }

    get length() {
        return this.text.length;
    }

    public isTagActive(tag: MarkupTag) {
        for (const markup of this.activeInlineMarkups) {
            if (markup[0] === tag) return true;
        }

        return false;
    }
}

export default State;