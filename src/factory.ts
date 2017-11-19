import RichTextEditor from './RichTextEditor';

function factory(el: HTMLElement, config: any={}): RichTextEditor {
    const richTextEditor = new RichTextEditor(el, config);

    return richTextEditor;
}

export default factory;