import Markup from '../Markup';

function cloneMarkup(markup: Markup): Markup {
    return new Markup(markup.toArray());
}

export default cloneMarkup;