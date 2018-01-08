import merge from 'helpful-merge';

import MarkupTag     from '../constants/MarkupTag';
import IValue        from '../interfaces/IValue';
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

    constructor(rawValue: IValue = null) {
        if (rawValue && typeof rawValue === 'object') {
            // Coerces a raw "value" into an instance of state

            merge(this, rawValue);

            const textLength = this.text.length;

            if (this.markups.length < 1) {
                this.markups.push(new Markup([MarkupTag.P, 0, textLength]));
            }

            // Coerce triplets into `Markup` if needed

            this.markups = this.markups.map(markup => Array.isArray(markup) ? new Markup(markup) : markup);
        }

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