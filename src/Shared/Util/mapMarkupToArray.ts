import IMarkup from '../../State/Interfaces/IMarkup';
import Markup  from '../../State/Markup';

function mapMarkupToArray(markup: Markup): IMarkup {
    return markup.toArray();
}

export default mapMarkupToArray;