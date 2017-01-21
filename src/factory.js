import RichTextEditor from './RichTextEditor';
import data           from './data.json';

function factory(el, configRaw) {
    const richTextEditor = new RichTextEditor();

    richTextEditor.attach(el, configRaw || {
        text: data.text,
        format: data.format
    });

    return richTextEditor;
}

module.exports = factory;