import TomeNode from './TomeNode';

class Caret {
    path:   Array<number> = null;
    node:   TomeNode      = null;
    offset: number        = null;
}

export default Caret;