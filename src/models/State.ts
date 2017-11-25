import MarkupTag     from '../constants/MarkupTag';
import MarkupsMap    from '../models/MarkupsMap';
import Markup        from './Markup';
import TomeSelection from './TomeSelection';

class State {
    public text:                  string        = '';
    public markups:               Markup[]      = [];
    public selection:             TomeSelection = new TomeSelection();
    public activeBlockMarkup:     Markup        = null;
    public envelopedBlockMarkups: Markup[]      = [];
    public activeInlineMarkups:   MarkupsMap    = new MarkupsMap();

    constructor() {
        Object.seal(this);
    }

    get length() {
        return this.text.length;
    }

    public isTagActive(tag: MarkupTag) {
        return this.activeInlineMarkups.allOfTag(tag).length > 0;
    }
}

export default State;