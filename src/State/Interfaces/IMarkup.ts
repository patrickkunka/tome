import MarkupTag from '../Constants/MarkupTag';

interface IMarkup {
    0: MarkupTag|string;
    1: number;
    2: number;
    3?: any;
}

export default IMarkup;