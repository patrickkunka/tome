
import Caret              from '../../Tree/Caret';
import TomeNode           from '../../Tree/TomeNode';
import SelectionDirection from '../Constants/SelectionDirection';
import TomeSelection      from '../TomeSelection';

import {
    getNodeByPath,
    getPathFromDomNode,
    isGreaterPath
} from '../../Shared/Util';

function getRangeFromSelection(selection: Selection, root: TomeNode): TomeSelection {
    const anchorPath = getPathFromDomNode(selection.anchorNode, this.tome.dom.root);
    const from = new Caret();
    const to = new Caret();

    let virtualAnchorNode = getNodeByPath(anchorPath, root);
    let anchorOffset = selection.anchorOffset;
    let extentOffset = selection.extentOffset;

    if ((virtualAnchorNode.isBlock || virtualAnchorNode.isListItem) && anchorOffset > 0) {
        // Caret is lodged between a safety <br> and
        // the end of block

        const childIndex = Math.min(virtualAnchorNode.childNodes.length - 1, anchorOffset);

        virtualAnchorNode = virtualAnchorNode.childNodes[childIndex];
        anchorOffset = virtualAnchorNode.text.length;
    }

    if (virtualAnchorNode.isText && virtualAnchorNode.parent === root && anchorOffset > 0) {
        // Caret is lodged in a block break between blocks

        const [index] = anchorPath;

        virtualAnchorNode = root.childNodes[index + 1];
        anchorOffset = 0;
    }

    let extentPath = anchorPath;
    let virtualExtentNode: TomeNode = virtualAnchorNode;
    let isRtl = false;
    let rangeFrom = -1;
    let rangeTo = -1;

    if (!selection.isCollapsed) {
        extentPath = getPathFromDomNode(selection.extentNode, this.tome.dom.root);
        virtualExtentNode = getNodeByPath(extentPath, root);

        if ((virtualExtentNode.isBlock || virtualExtentNode.isListItem) && extentOffset > 0) {
            const childIndex = Math.min(virtualExtentNode.childNodes.length - 1, extentOffset);

            virtualExtentNode = virtualExtentNode.childNodes[childIndex];
            extentOffset = virtualExtentNode.text.length;
        }
    }

    // If the anchor is greater than the extent, or both paths are equal
    // but the anchor offset is greater than the extent offset, the range
    // should be considered "RTL"

    isRtl =
        isGreaterPath(anchorPath, extentPath) ||
        (!isGreaterPath(extentPath, anchorPath) && selection.anchorOffset > selection.extentOffset);

    from.node   = to.node = isRtl ? virtualExtentNode : virtualAnchorNode;
    from.offset = to.offset = isRtl ? extentOffset : anchorOffset;
    from.path   = to.path = isRtl ? extentPath : anchorPath;

    if (!selection.isCollapsed) {
        to.node   = isRtl ? virtualAnchorNode : virtualExtentNode;
        to.offset = isRtl ? anchorOffset : extentOffset;
        to.path   = isRtl ? anchorPath : extentPath;
    }

    rangeFrom = Math.min(from.node.start + from.offset, from.node.end);
    rangeTo = Math.min(to.node.start + to.offset, to.node.end);

    return new TomeSelection(rangeFrom, rangeTo, isRtl ? SelectionDirection.RTL : SelectionDirection.LTR);
}

export default getRangeFromSelection;