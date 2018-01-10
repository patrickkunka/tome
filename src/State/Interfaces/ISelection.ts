import SelectionDirection from '../Constants/SelectionDirection';

interface ISelection {
    from:       number;
    to:         number;
    direction?: SelectionDirection;
}

export default ISelection;