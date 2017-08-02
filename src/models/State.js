import Range from './Range';

class State {
    constructor() {
        this.text                   = '';
        this.markups                = [];
        this.selection              = new Range();
        this.activeBlockMarkup      = null;
        this.activeInlineMarkups    = [];
        this.envelopedBlockMarkups  = [];

        Object.seal(this);
    }

    get length() {
        return this.text.length;
    }

    isTagActive(tag) {
        for (let i = 0, markup; (markup = this.activeInlineMarkups[i]); i++) {
            if (markup[0] === tag) return true;
        }

        return false;
    }
}

export default State;