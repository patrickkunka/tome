import IValue      from '../../State/Interfaces/IValue';
import Markup      from '../../State/Markup';
import TomeNode    from '../TomeNode';
import TreeBuilder from '../TreeBuilder';

function buildTreeFromValue(value: IValue): TomeNode {
    const markups = value.markups.map(markup => Array.isArray(markup) ? new Markup(markup) : markup as Markup);

    const root = new TomeNode();

    TreeBuilder.build(root, value.text, markups);

    return root;
}

export default buildTreeFromValue;