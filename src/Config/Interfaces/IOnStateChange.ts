import ActionType from '../../State/Constants/ActionType';
import State      from '../../State/State';

type IOnStateChange = (state: State, actionType: ActionType) => void;

export default IOnStateChange;