import MarkupTag from '../Constants/MarkupTag';
import Markup    from '../Markup';

/**
 * Removes or shortens any markups matching the provided tag within the
 * provided range.
 */

function ingestMarkups(markups: Markup[], tag: MarkupTag, from: number, to: number): void {
    for (let i = 0, markup; (markup = markups[i]); i++) {
        if (markup.tag !== tag) continue;

        if (markup.start >= from && markup.end <= to) {
            // Markup enveloped, remove

            markups.splice(i, 1);

            i--;
        } else if (markup.start < from && markup.end >= to) {
            // Markup overlaps start, shorten by moving end to
            // start of selection

            if (markup.end > to) {
                let newMarkup: Markup;

                // Split markup into two

                if (markup.data !== null) {
                    newMarkup = new Markup([markup.tag, to, markup.end, markup.data]);
                } else {
                    newMarkup = new Markup([markup.tag, to, markup.end]);
                }

                markups.splice(i + 1, 0, newMarkup);

                i++;
            }

            markup[2] = from;
        } else if (markup.start > from && markup.start < to) {
            // Markup overlaps end, shorten by moving start to
            // end of selection

            markup[1] = to;
        } else if (markup.start === from && markup.end > to) {
            // Markup envelops range from start

            markup[1] = to;
        }
    }
}

export default ingestMarkups;