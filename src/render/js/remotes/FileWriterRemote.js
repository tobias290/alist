/**
 * Calls main process functions to handle writing and getting local files.
 */
import Remote from "./Remote";

export default class FileWriterRemote extends Remote {
    /**
     * @private
     *
     * Use main process modules from the renderer process.
     *
     */
    static fileWriter = FileWriterRemote.remote.require("./fileWriter");

    /**
     * Gets the content of the last opened file.
     *
     * @param callback - Callback which will be called if the contents are retrieved, if no file was last opened then the callback is not called.
     */
    static getLastOpenedFile(callback) {
        FileWriterRemote.fileWriter.getLastOpenedFile(callback);
    }

    /**
     * Writes json to a file.
     *
     * @param json - JSON to write to the file.
     * @param callback - Callback called when the contents have been retrieved.
     */
    static write(json, callback) {
        FileWriterRemote.fileWriter.write(json, callback);
    }

    /**
     * Gets data as JSON.
     *
     * @param callback - Callback which will be called (2 params are 'err' and 'json')
     */
    static get(callback) {
        FileWriterRemote.fileWriter.get(callback);
    }

    /**
     * Gets data as JSON.
     *
     * @param path - Path of file.
     * @param callback - Callback which will be called (2 params are 'err' and 'json').
     */
    static getFromPath(path, callback) {
        FileWriterRemote.fileWriter.getFromPath(path, callback);
    }

    /**
     * Create a new file.
     *
     * @param callback - Callback to run any code after the new file has been made and the current file path has been updated.
     */
    static new(callback) {
        FileWriterRemote.fileWriter.new(callback);
    }

    /**
     * Opens a existing file.
     *
     * @param callback - Callback with a parameter of the contents of the opened file.
     */
    static open(callback) {
        FileWriterRemote.fileWriter.open(callback);
    }
}