const electron = require("electron");
const app = electron.app;
const globalShortcut = electron.globalShortcut;

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow, tray;

function createWindow() {
    // TODO: separate JSON file for settings
    mainWindow = new electron.BrowserWindow({
        width: 400,
        height: 700,
        maxWidth: 1000,
        minWidth: 400,
        resizable: false,
        frame: false,
    });

    mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, '../build/index.html')}`);
    mainWindow.on("closed", () => mainWindow = null);

    createTray();

    registerShortcuts();
}

function createTray() {
    tray = new electron.Tray(path.join(__dirname, "../render/images/favicon.ico"));

    let recentFiles = [];

    let config = require("../../config.json");

    for (let recentFile of config.recentFiles) {
        recentFiles.push({
            label: recentFile, //.split("\\")[recentFile.split("\\").length - 1], // NOTE: Could display full path
            type: "normal",
            click: () => {
                mainWindow.show();
                mainWindow.send("open-from-path", recentFile);
            }
        });
    }

    // TODO: add minimise and maximise to options

    const contextMenu = electron.Menu.buildFromTemplate([
        {
            label: "Recent Files",
            submenu: recentFiles,
        },
        {type: "separator"},
        {
            label: "New",
            click: () => {
                mainWindow.show();
                mainWindow.send("new");
            }
        },
        {
            label: "Open",
            click: () => {
                mainWindow.show();
                mainWindow.send("open");
            }
        },
        {type: "separator"},
        {
            label: "Settings",
            click: () => {
                mainWindow.show();
                mainWindow.send("settings");
            }
        },
        {type: "separator"},
        {
            label: "Exit",
            click: () => app.quit(),
        },
    ]);

    tray.setToolTip("alist");
    tray.setContextMenu(contextMenu);
}

function registerShortcuts() {
    const openFileCommand = globalShortcut.register("Control+O", () => {
        mainWindow.send("open")
    });

    if (!openFileCommand) {
        console.log("Failed to register open file shortcut.")
    }

    const newFileCommand = globalShortcut.register("Control+N", () => {
        mainWindow.send("new")
    });

    if (!newFileCommand) {
        console.log("Failed to register new file shortcut.");
    }

    const openSettingsCommand = globalShortcut.register("Control+S", () => {
        mainWindow.send("settings")
    });

    if (!openSettingsCommand) {
        console.log("Failed to register open settings shortcut.");
    }

    const quitCommand = globalShortcut.register("Control+Q", () => {
        app.quit();
    });

    if (!quitCommand) {
        console.log("Failed to register new file shortcut.");
    }
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

process.on("uncaughtException", (err) => {
    let logger = require("logger").createLogger("errors.log");

    logger.setLevel("error");
    logger.error(err);
});