/**
 * Class to access properties and methods of the applications window.
 */
import Remote from "./Remote";

export default class WindowRemote extends Remote {
    /**
     * @private
     *
     * Application 'BrowserWindow' instance.
     *
     * @type {Electron.BrowserWindow}
     */
    static window = WindowRemote.remote.BrowserWindow.getFocusedWindow();

    /**
     * @public
     *
     * Minimises the application.
     */
    static minimise() {
        WindowRemote.window.minimize();
    }

    /**
     * @public
     *
     * Closes the application.
     */
    static close() {
        WindowRemote.window.close();
    }

    /**
     * @public
     *
     * Quits the application.
     */
    static quit() {
        WindowRemote.remote.app.quit();
    }

    /**
     * @public
     *
     * @returns {number} Returns the windows width.
     */
    static getWidth() {
        return WindowRemote.window.getSize()[0];
    }

    /**
     * @public
     *
     * @returns {number} Returns the windows height.
     */
    static getHeight() {
        return WindowRemote.window.getSize()[1];
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
        WindowRemote.window.setSize(width, height);
    }

    /**
     * @public
     *
     * Centers the application on the user's screen.
     */
    static center() {
        WindowRemote.window.center();
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
        let currentWidth = WindowRemote.getWidth();
        let isDecreasing = newWidth < currentWidth;

        // Called every millisecond and stopped once the window has reached the given 'newWidth'
        let interval = setInterval(() => {
            // If decreasing reduce the width, else increase the width
            currentWidth = isDecreasing ? currentWidth - 10 : currentWidth + 10;

            // Set the size and recenter the window
            WindowRemote.setSize(currentWidth, WindowRemote.getHeight()); // TODO: change number to get value from electron

            if (center) WindowRemote.center();

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
            WindowRemote.animateWidthResize(WindowRemote.window.getMinimumSize()[0], center);
        else
            WindowRemote.setSize(WindowRemote.window.getMinimumSize()[0], WindowRemote.getHeight())
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
            WindowRemote.animateWidthResize(WindowRemote.window.getMaximumSize()[0], center);
         else
            WindowRemote.setSize(WindowRemote.window.getMaximumSize()[0], WindowRemote.getHeight())
    }
}