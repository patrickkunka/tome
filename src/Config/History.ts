import IHistory from './Interfaces/IHistory';

class History implements IHistory {
    public limit = 200;

    constructor() {
        Object.seal(this);
    }
}

export default History;