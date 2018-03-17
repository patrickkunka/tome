import MarkupType  from '../../State/Constants/MarkupType';
import IValue      from '../../State/Interfaces/IValue';
import Markup      from '../../State/Markup';
import IModule     from '../Interfaces/IModule';
import Renderer    from '../Renderer';
import TomeNode    from '../TomeNode';
import TreeBuilder from '../TreeBuilder';

function valueToModules(value: IValue): IModule[] {
    const markups = value.markups.map(markup => Array.isArray(markup) ? new Markup(markup) : markup as Markup);
    const root = new TomeNode();

    TreeBuilder.build(root, value.text, markups);

    const modules: IModule[] = root.childNodes.reduce(reduceTreeToModules, []);

    return modules;
}

function reduceTreeToModules(modules: IModule[], node: TomeNode): IModule[] {
    switch (node.type) {
        case MarkupType.CUSTOM_BLOCK:
            modules.push(buildCustomBlockModule(node));

            break;
        case MarkupType.BLOCK:
            modules.push(buildBlockModule(node));

            break;
    }

    return modules;
}

function buildCustomBlockModule(node: TomeNode): IModule {
    return {
        name: node.tag,
        data: node.data
    };
}

function buildBlockModule(node: TomeNode): IModule {
    const html = Renderer.renderNode(node, node.parent, [], true);

    const data = {
        content: html
    };

    return {
        name: node.tag,
        data
    };
}

export default valueToModules;