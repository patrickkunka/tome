import RichTextEditor from './RichTextEditor';

function factory(el, config={}) {
    const richTextEditor = new RichTextEditor(el, config);

    return richTextEditor;
}

module.exports = factory;