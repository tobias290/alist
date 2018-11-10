/**
 * Class to access properties and methods of the applications window.
 */
export default class ElectronRemote {
    /**
     * @private
     *
     * Use main process modules from the renderer process.
     *
     * @type {Electron.Remote | boolean | RTCIceCandidateDictionary}
     */
    static remote = window.require("electron").remote;

    /**
     * @private
     *
     * Application 'BrowserWindow' instance.
     *
     * @type {Electron.BrowserWindow}
     */
    static window = ElectronRemote.remote.BrowserWindow.getFocusedWindow();

    static openDevWindow() {
        ElectronRemote.window.webContents.openDevTools();
    }

    /**
     * @public
     *
     * Minimises the application.
     */
    static minimise() {
        ElectronRemote.window.minimize();
    }

    /**
     * @public
     *
     * Closes the application.
     */
    static close() {
        ElectronRemote.window.close();
    }

    /**
     * @public
     *
     * Quits the application.
     */
    static quit() {
        ElectronRemote.remote.app.quit();
    }

    /**
     * @public
     *
     * @returns {number} Returns the windows width.
     */
    static getWidth() {
        return ElectronRemote.window.getSize()[0];
    }

    /**
     * @public
     *
     * @returns {number} Returns the windows height.
     */
    static getHeight() {
        return ElectronRemote.window.getSize()[1];
    }

    /**
     * @public
     *
     * Sets the size of the window.
     *
     * @param {number} width - New width for the window.
     * @param {number} height - New height for the window.
     */
    static setSize(width, height) {
        ElectronRemote.window.setSize(width, height);
    }

    /**
     * @public
     *
     * Centers the application on the user's screen.
     */
    static center() {
        ElectronRemote.window.center();
    }

    /**
     * @public
     *
     * Sets a new width for the window and animates the resizing.
     *
     * @param {number} newWidth - New width for the window.
     * @param {boolean} center - If true the window will be centered while resizing
     */
    static animateWidthResize(newWidth, center=true) {
        let currentWidth = ElectronRemote.getWidth();
        let isDecreasing = newWidth < currentWidth;

        // Called every millisecond and stopped once the window has reached the given 'newWidth'
        let interval = setInterval(() => {
            // If decreasing reduce the width, else increase the width
            currentWidth = isDecreasing ? currentWidth - 10 : currentWidth + 10;

            // Set the size and recenter the window
            ElectronRemote.setSize(currentWidth, ElectronRemote.getHeight()); // TODO: change number to get value from electron

            if (center) ElectronRemote.center();

            // Once the width has reached the given width stop the function
            if ((isDecreasing && currentWidth <= newWidth) || (!isDecreasing && currentWidth >= newWidth))
                clearInterval(interval);

        }, 1);
    }

    /**
     * @public
     *
     * Resizes the window to specified minimum width.
     *
     * @param {boolean} animate - If true the resizing will be animated. (Default - true)
     * @param {boolean} center - If true the window will be centered while resizing
     */
    static resizeToMinWidth(animate=true, center=true) {
        if (animate)
            ElectronRemote.animateWidthResize(ElectronRemote.window.getMinimumSize()[0], center);
        else
            ElectronRemote.setSize(ElectronRemote.window.getMinimumSize()[0], ElectronRemote.getHeight())
    }

    /**
     * @public
     *
     * Resizes the window to specified maximum width.
     *
     * @param animate - If true the resizing will be animated. (Default - true)
     * @param {boolean} center - If true the window will be centered while resizing
     */
    static resizeToMaxWidth(animate=true, center=true) {
        if (animate)
            ElectronRemote.animateWidthResize(ElectronRemote.window.getMaximumSize()[0], center);
         else
            ElectronRemote.setSize(ElectronRemote.window.getMaximumSize()[0], ElectronRemote.getHeight())
    }
}