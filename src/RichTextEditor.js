import Config       from './Config';
import Dom          from './Dom';
import Util         from './Util';
import Formatlet    from './models/Formatlet';
import Node         from './models/Node';
import Caret        from './models/Caret';
import Range        from './models/Range';
import TreeBuilder  from './TreeBuilder';
import Renderer     from './Renderer';

class RichTextEditor {
    constructor() {
        this.dom    = new Dom();
        this.config = new Config();
        this.root   = null;
    }

    attach(el, configRaw) {
        this.dom.root = el;

        Util.extend(this.config, configRaw);

        this.transformData();

        this.render();

        this.bindEvents();
    }

    transformData() {
        const text = this.config.text;
        const format = this.config.format.map(format => new Formatlet(format));

        this.root = new Node();

        this.root.start = 0;
        this.root.end = text.length - 1;

        TreeBuilder.buildTree(text, format, this.root);

        console.log(this.root);
    }

    render() {
        this.dom.root.innerHTML = Renderer.renderNodes(this.root.childNodes);
    }

    bindEvents() {
        this.dom.root.addEventListener('keypress', this.handleKeypress.bind(this));
    }

    handleKeypress(e) {
        const selection = window.getSelection();
        const range = this.getRangeFromSelection(selection);
        const characters = e.key;

        let newCaretOffset = -1;

        TreeBuilder.insertCharacters(e.key, range);

        this.render();

        // position cursor at end of "to" offset (move out of class)

        newCaretOffset = range.from.offset + characters.length;

        this.positionCaretByPathAndOffset(range.from.path, newCaretOffset);

        e.preventDefault();
    }

    getPathFromNode(node) {
        const path = [];

        while (node && node !== this.dom.root) {
            path.unshift(Util.index(node, true));

            node = node.parentElement;
        }

        return path;
    }

    getNodeByPath(path, root) {
        let node = root;
        let index = -1;
        let i = 0;

        console.log(path, node);

        while (typeof (index = path[i]) === 'number') {
            node = node.childNodes[index];

            i++;
        }

        return node || null;
    }

    getRangeFromSelection(selection) {
        const anchorPath = this.getPathFromNode(selection.anchorNode);
        const virtualAnchorNode = this.getNodeByPath(anchorPath, this.root);
        const from = new Caret();
        const to = new Caret();

        let extentPath = anchorPath;
        let virtualExtentNode = virtualAnchorNode;
        let isRtl = false;

        if (!selection.isCollapsed) {
            extentPath = this.getPathFromNode(selection.extentNode);
            virtualExtentNode = this.getNodeByPath(extentPath, this.root);
        }

        isRtl = extentPath < anchorPath;

        from.node   = to.node = isRtl ? virtualExtentNode : virtualAnchorNode;
        from.offset = to.offset = isRtl ? selection.extentOffset : selection.anchorOffset;
        from.path   = to.path = isRtl ? extentPath : anchorPath;

        if (!selection.isCollapsed) {
            to.node     = isRtl ? virtualAnchorNode : virtualExtentNode;
            to.offset   = isRtl ? selection.anchorOffset : selection.extentOffset;
            to.path     = isRtl ? anchorPath : extentPath;
        }

        return new Range(from, to);
    }

    positionCaretByPathAndOffset(path, offset) {
        const range = document.createRange();
        const node = this.getNodeByPath(path, this.dom.root);
        const selection = window.getSelection();

        range.setStart(node, offset);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);
    }
}

export default RichTextEditor;