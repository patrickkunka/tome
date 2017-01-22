import State    from './models/State';
import Markup   from './models/Markup';

class Editor {
    static insertCharacters(state, characters, fromIndex, toIndex) {
        const newState = new State();
        const totalDeleted = toIndex - fromIndex;
        const totalAdded = characters.length;
        const adjustment = totalAdded - totalDeleted;

        newState.text = state.text.slice(0, fromIndex) + characters + state.text.slice(toIndex);

        newState.markups = Editor.adjustMarkups(state.markups, fromIndex, toIndex, totalAdded, adjustment);

        newState.selection = [fromIndex + totalAdded, fromIndex + totalAdded];

        return newState;
    }

    static adjustMarkups(markups, fromIndex, toIndex, totalAdded, adjustment) {
        const newMarkups = [];

        for (let i = 0, markup; (markup = markups[i]); i++) {
            const [tag, start, end] = markup;
            const newMarkup = new Markup(markup);

            if (!(markup instanceof Markup)) {
                markup = new Markup(markup);
            }

            // Selection completely envelopes markup

            if (start > fromIndex && end < toIndex) continue;

            if (start <= fromIndex && end >= toIndex) {
                // Selection within markup or equal to markup

                newMarkup[2] += adjustment;

                if (markup.isInline && (start === fromIndex && fromIndex === toIndex)) {
                    // Collapsed caret at start of inline markup

                    newMarkup[1] += adjustment;
                }
            } else if (start > toIndex) {
                // Markup after Selection

                newMarkup[1] += adjustment;
                newMarkup[2] += adjustment;
            } else if (fromIndex < start && toIndex > start && toIndex < end) {
                // Selection partially envelopes markup from start

                newMarkup[1] += (adjustment + (toIndex - start));
                newMarkup[2] += adjustment;
            } else if (fromIndex > start && fromIndex < end && toIndex > end) {
                // Selection partially envelopes markup from end

                newMarkup[2] = fromIndex + totalAdded;
            }

            newMarkups.push(newMarkup);
        }

        return newMarkups;
    }
}

export default Editor;