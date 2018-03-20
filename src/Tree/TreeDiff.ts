import {getMarkupType}   from '../Shared/Util';
import MarkupType        from '../State/Constants/MarkupType';
import NodeChangeType    from './Constants/NodeChangeType';
import ITreePatchCommand from './Interfaces/ITreePatchCommand';
import TextDiff          from './TextDiff';
import TomeNode          from './TomeNode';
import TreePatchCommand  from './TreePatchCommand';
import TreePatchCommandList from './TreePatchCommandList';

const {
    NONE,
    ADD,
    REMOVE,
    UPDATE_TEXT,
    UPDATE_TAG,
    UPDATE_CHILDREN,
    UPDATE_NODE
} = NodeChangeType;

/**
 * A static class for comparing the previous and next versions of the in-memory
 * tree, in order to minimise DOM manipulation between state updates.
 */

class TreeDiff {
    // The higher the scan offsets, the more expensive the diff. These are currently set at
    // 2 to accomodate the most common list operation: the addition or deletion of a
    // block node and its sibling line-break node.

    // TODO: In the future, certain operations such as multi-block cut/paste/delete could be
    // optimised through higher offsets.

    public static MAX_SCAN_OFFSET_ADD = 2;
    public static MAX_SCAN_OFFSET_REMOVE = 2;

    /**
     * Recursively diffs the previous and next versions of a provided node in the tree.
     * Returns a traversable `TreePatchCommand` containing all neccessary operations to
     * patch the previous tree into the next one.
     */

    public static diff(prevNode: TomeNode, nextNode: TomeNode): TreePatchCommand {
        return TreeDiff.diffNodes(prevNode, nextNode);
    }

    /**
     * Receives the previous and next `childNodes` arrays for a given node and determines
     * if any nodes have been added, removed or updated.
     *
     * Returns a list of `TreePatchCommand` containing all neccessary operations to patch
     * the previous list into the next one.
     */

    private static diffChildren(
        prevChildren:   TomeNode[],
        nextChildren:   TomeNode[],
        commands:       TreePatchCommandList = new TreePatchCommandList(),
        prevPointer:    number               = 0,
        nextPointer:    number               = 0
    ): TreePatchCommandList {
        const prevChild = prevChildren[prevPointer];
        const nextChild = nextChildren[nextPointer];

        // If there are no children at this index, we have reached the end. Return
        // the populated commands array.

        if (!prevChild && !nextChild) return commands;

        const initialDiff = TreeDiff.diffNodes(prevChild, nextChild);

        let isNodeUpdated = false;

        if (!initialDiff.isNone) {
            // If the initial diff yields differences, check to see if nodes
            // have been added or removed before assuming the node has been
            // updated

            const totalAddedNodes = TreeDiff.detectAddedNodes(prevChild, nextChildren, commands, nextPointer);

            if (totalAddedNodes > 0) {
                // Nodes added, increment the next pointer only

                nextPointer = nextPointer + totalAddedNodes;
            } else {
                const totalRemovedNodes = TreeDiff.detectRemovedNodes(nextChild, prevChildren, commands, prevPointer);

                if (totalRemovedNodes > 0) {
                    // Nodes removed, increment the previous pointer only

                    prevPointer = prevPointer + totalRemovedNodes;
                } else {
                    // Within the limits of the scan offsets, there is no indication that nodes have been added or
                    // removed, therefore an update must be assumed.

                    isNodeUpdated = true;
                }
            }
        }

        if (initialDiff.isNone || isNodeUpdated) {
            // Unchanged or updated, but still in parallel. Push initial patch command.

            prevPointer++;
            nextPointer++;

            commands.push(initialDiff);
        }

        // Proceed to next pair

        return TreeDiff.diffChildren(prevChildren, nextChildren, commands, prevPointer, nextPointer);
    }

    /**
     * Compares the provided node from the parent node's previous children with
     * a range of nodes from the parent node's next children.
     *
     * If node matches a next child up to an offset of `MAX_SCAN_OFFSET_ADD`,
     * the corresponding `ADD` patch commands are pushed into the `commands`
     * array, and the offset is returned in order to balance the next diff.
     */

    private static detectAddedNodes(
        prevChild: TomeNode,
        nextChildren: TomeNode[],
        commands: TreePatchCommandList,
        nextPointer: number
    ): number {
        const newCommands = [];

        let offset = 0;
        let matchFound = false;

        while (!matchFound && offset <= TreeDiff.MAX_SCAN_OFFSET_ADD) {
            newCommands.push(TreeDiff.createAddCommand(nextChildren[nextPointer + offset]));

            offset++;

            matchFound = prevChild ? TreeDiff.isEqualNode(prevChild, nextChildren[nextPointer + offset]) : true;
        }

        if (!matchFound) return 0;

        commands.push(...newCommands);

        return offset;
    }

    /**
     * Compares the provided node from the parent node's next children with
     * a range of nodes from the parent node's previous children.
     *
     * If node matches a previous child up to an offset of `MAX_SCAN_OFFSET_REMOVE`,
     * the corresponding `REMOVE` patch commands are pushed into the `commands`
     * array, and the offset is returned in order to balance the next diff.
     */

    private static detectRemovedNodes(
        nextChild: TomeNode,
        prevChildren: TomeNode[],
        commands: TreePatchCommandList,
        prevPointer: number
    ): number {
        const newCommands = [];

        let offset = 0;
        let matchFound = false;

        while (!matchFound && offset <= TreeDiff.MAX_SCAN_OFFSET_REMOVE) {
            newCommands.push(TreeDiff.createRemoveCommand(prevChildren[prevPointer + offset]));

            offset++;

            matchFound = nextChild ? TreeDiff.isEqualNode(prevChildren[prevPointer + offset], nextChild) : true;
        }

        if (!matchFound) return 0;

        commands.push(...newCommands);

        return offset;
    }

    /**
     * Compares two provided nodes in order to determine the differences, if any, between them.
     */

    private static diffNodes(prevNode: TomeNode = null, nextNode: TomeNode = null): TreePatchCommand {
        if (prevNode && !nextNode) {
            return TreeDiff.createRemoveCommand(prevNode);
        } else if (nextNode && !prevNode) {
            return TreeDiff.createAddCommand(nextNode);
        } else if (
            prevNode && nextNode &&
            prevNode.childNodes.length === 0 && nextNode.childNodes.length === 0
        ) {
            // Text nodes

            return prevNode.text === nextNode.text ?
                TreeDiff.createMaintainNodeCommand() :
                TreeDiff.createUpdateTextCommand(prevNode.text, nextNode.text);
        }

        // HTML elements

        const childCommands = TreeDiff.diffChildren(prevNode.childNodes, nextNode.childNodes);
        const hasChildChanges = TreeDiff.hasChildChanges(childCommands);
        const prevMarkupType = getMarkupType(prevNode.tag);
        const nextMarkupType = getMarkupType(nextNode.tag);
        const isPrevNodeCustomBlock = prevMarkupType === MarkupType.CUSTOM_BLOCK;
        const isNextNodeCustomBlock = nextMarkupType === MarkupType.CUSTOM_BLOCK;

        if (prevNode.tag !== nextNode.tag) {
            return hasChildChanges || isNextNodeCustomBlock ?
                TreeDiff.createUpdateNodeCommand(nextNode) :
                TreeDiff.createUpdateTagCommand(nextNode);
        } else if (isPrevNodeCustomBlock && isNextNodeCustomBlock && prevNode.data !== nextNode.data) {
            // Two custom blocks of same type, but different data

            return TreeDiff.createUpdateNodeCommand(nextNode);
        }

        return hasChildChanges ?
            TreeDiff.createUpdateChildrenCommand(childCommands) :
            TreeDiff.createMaintainNodeCommand();
    }

    /**
     * Creates and maps a patch command representing a node to be added.
     */

    private static createAddCommand(nextNode: TomeNode): TreePatchCommand {
        return TreeDiff.createPatchCommand({
            type: ADD,
            nextNode
        });
    }

    /**
     * Creates and maps a patch command representing a node to be removed.
     */

    private static createRemoveCommand(prevNode: TomeNode): TreePatchCommand {
        return TreeDiff.createPatchCommand({type: REMOVE, prevNode});
    }

    /**
     * Returns a mapped patch command representing a node with text content to be updated.
     */

    private static createUpdateTextCommand(prevText, nextText): TreePatchCommand {
        const textPatchCommand = TextDiff.diff(prevText, nextText);

        return TreeDiff.createPatchCommand({
            type: UPDATE_TEXT,
            textPatchCommand
        });
    }

    /**
     * Returns a mapped patch command representing a node with a tag to be changed.
     */

    private static createUpdateTagCommand(nextNode: TomeNode): TreePatchCommand {
        return TreeDiff.createPatchCommand({
            type: UPDATE_TAG,
            nextTag: nextNode.tag
        });
    }

    /**
     * Returns a mapped patch command representing a node with changes to its children.
     */

    private static createUpdateChildrenCommand(childCommands: TreePatchCommandList): TreePatchCommand {
        return TreeDiff.createPatchCommand({
            type: UPDATE_CHILDREN,
            childCommands
        });
    }

    /**
     * Returns a mapped patch command representing a node to be replaced with a different node.
     */

    private static createUpdateNodeCommand(nextNode: TomeNode): TreePatchCommand {
        return TreeDiff.createPatchCommand({
            type: UPDATE_NODE,
            nextNode
        });
    }

    /**
     * An alias for `createPatchCommand()` when a node persists.
     */

    private static createMaintainNodeCommand(): TreePatchCommand {
        return TreeDiff.createPatchCommand();
    }

    /**
     * Returns an unmapped patch command, or if initial data is provided, a command mapped with
     * that data.
     */

    private static createPatchCommand(initialData: ITreePatchCommand = null): TreePatchCommand {
        const command = new TreePatchCommand();

        return initialData ? Object.assign(command, initialData) : command;
    }

    /**
     * Iterates through all provided child commands, breaking and returning `true` once
     * a command is found with a change type other than `NONE`.
     */

    private static hasChildChanges(childCommands): boolean {
        return childCommands.some(childCommand => childCommand.type !== NodeChangeType.NONE);
    }

    /**
     * Diffs the two provided nodes and returns `true` if there are no
     * differences between them.
     */

    private static isEqualNode(prevNode, nextNode) {
        return TreeDiff.diffNodes(prevNode, nextNode).type === NONE;
    }
}

export default TreeDiff;