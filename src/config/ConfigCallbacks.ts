class ConfigCallbacks {
    onStateChange: Function=null;
    onValueChange: Function=null;

    constructor() {
        Object.seal(this);
    }
}
export default ConfigCallbacks;