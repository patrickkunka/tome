import SelectionDirection from '../constants/SelectionDirection';

interface ISelection {
    from: number;
    to:   number;
    direction?: SelectionDirection;
}

export default ISelection;