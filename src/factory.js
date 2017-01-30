import RichTextEditor from './RichTextEditor';
import data           from '../tests/data.json';

function factory(el) {
    const richTextEditor = new RichTextEditor();

    richTextEditor.attach(el, data);

    return richTextEditor;
}

module.exports = factory;