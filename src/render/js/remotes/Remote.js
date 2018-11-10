/**
 * Allows access to processes, variable, methods available in the main process.
 */
export default class Remote {
    /**
     * @protected
     *
     * Use main process modules from the renderer process.
     *
     * @type {Electron.Remote | boolean | RTCIceCandidateDictionary}
     */
    static remote = window.require("electron").remote;

    /**
     * Gets a global variable set in the main process.
     *
     * @param {string} name - Name of the global variable.
     * @returns {*} - Returns the value of the global variable.
     */
    static getGlobal(name) {
        return Remote.remote.getGlobal(name);
    }

    /**
     * Opens the development tools window.
     */
    static openDevWindow() {
        Remote.remote.getCurrentWindow().webContents.openDevTools();
    }
}