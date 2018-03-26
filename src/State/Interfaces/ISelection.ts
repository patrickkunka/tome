import SelectionDirection from '../Constants/SelectionDirection';

interface ISelection {
    from:       number;
    to:         number;
    direction?: SelectionDirection;
    isCollapsed?: boolean;
}

export default ISelection;