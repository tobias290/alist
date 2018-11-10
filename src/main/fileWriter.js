// TODO: Change destination of config file to app data

/**
 * Saves the name of the last opened file
 *
 * @param fileName - Name of the file (file path)
 */
exports.setLastOpenedFile = (fileName) => {
    let fs = require("fs");

    // TODO: change to app data, file might not always be there
    let config = require("../../config.json");

    // Set file name to global property
    global.file = fileName;

    // Set file name in config
    config.lastOpenedFile = fileName;

    let isInRecentFiles = false;

    // Check to see if the given file has already been added to list of recent files
    for (let recentFile of config.recentFiles) {
        if (recentFile === fileName) {
            isInRecentFiles = true;
            break;
        }
    }

    // If file is not in list of recent files, then add it
    if (!isInRecentFiles) {
        config.recentFiles.push(fileName);
    }

    fs.writeFile("./config.json", JSON.stringify(config), function (err) {
        if (err) return console.log(err);
    });
};

/**
 * Gets the contents of the last opened file if any.
 *
 * @param callback - Called is a file was last opened (params - contents: Contents of the last opened file)
 */
exports.getLastOpenedFile = (callback) => {
    let fs = require("fs");

    fs.readFile("./config.json", "utf8", function (err, json) {
        if (!err) {
            global.file = JSON.parse(json).lastOpenedFile;

            fs.readFile(global.file, "utf8", function (err, json) {
                if (err) return console.log(err);

                callback(JSON.parse(json));
            });
        }
    });
};

/**
 * Writes json to a file.
 *
 * @param json - JSON to write to the file.
 * @param callback - Calls code once new data has been written to the file.
 */
exports.write = (json, callback) => {
    let fs = require('fs');

    fs.writeFile(global.file, JSON.stringify(json), function (err) {
        if (err) return console.log(err);

        callback();
    });
};

/**
 * Gets data as JSON.
 *
 * @param callback - Callback which will be called (2 params are 'err' and 'json')
 */
exports.get = (callback) => {
    if (global.file === "") {
        return callback(false, {
            "items": [],
            "order": [],
        });
    }

    let fs = require("fs");

    fs.readFile(global.file, "utf8", function (err, json) {
        if (err) return console.log(err);

        try {
            callback(err, JSON.parse(json));
        } catch (e) {
            console.log("Error: " + e);
            console.log(json);
        }
    });
};

/**
 * Gets data as JSON.
 *
 * @param path - Path of file.
 * @param callback - Callback which will be called (2 params are 'err' and 'json').
 */
exports.getFromPath = (path, callback) => {
    let fs = require("fs");

    exports.setLastOpenedFile(path);

    fs.readFile(path, "utf8", function (err, json) {
        if (err) return console.log(err);

        try {
            callback(err, JSON.parse(json));
        } catch (e) {
            console.log("Error: " + e);
            console.log(json);
        }
    });
};

/**
 * Create a new file.
 *
 * @param callback - Callback to run any code after the new file has been made and the current file path has been updated.
 */
exports.new = (callback) => {
    require("electron").dialog.showSaveDialog({
            title: "New",
            filters: [
                {name: "TODO File", extensions: ["todo"]},
            ]
        },
        (fileName) => {
            if (fileName === undefined) return;

            exports.setLastOpenedFile(fileName);

            exports.write([]);

            callback();
        });
};

/**
 * Opens a existing file.
 *
 * @param callback - Callback with a parameter of the contents of the opened file.
 */
exports.open = (callback) => {
    require("electron").dialog.showOpenDialog({
            title: "Open",
            filters: [
                {name: "TODO File", extensions: ["todo"]},
            ],
            properties: ["openFile", "createDirectory"]
        },
        (fileNames) => {
            if (fileNames === undefined) return;

            exports.setLastOpenedFile(fileNames[0]);

            exports.get((err, contents) => callback(contents));
        });
};
