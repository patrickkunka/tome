interface IEventManager {
    root: HTMLElement;
    bindEvents();
    unbindEvents();
    raiseIsActioningFlag();
}

export default IEventManager;