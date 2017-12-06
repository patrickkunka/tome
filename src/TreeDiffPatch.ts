import TomeNode from './models/TomeNode';

class TreeDiffPatch {
    public static diff(prev: TomeNode, next: TomeNode) {
        console.log('diff', prev, next);
    }
}

export default TreeDiffPatch;