class ConfigCallbacks {
    constructor() {
        this.onStateChange = null;
        this.onValueChange = null;

        Object.seal(this);
    }
}
export default ConfigCallbacks;