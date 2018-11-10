import React from 'react';

import TitleBar from "./TitleBar";
import List from "./List";
import NewItemPopup from "./NewItemPopup";
import Settings from "./Settings";

import ListHandler from "../js/ListHandler";

import FileWriterRemote from "../js/remotes/FileWriterRemote";

import "../css/index.css";

/**
 * Base component.
 */
export default class App extends React.Component {
    /**
     * @inheritDoc
     */
    constructor(props) {
        super(props);

        this.state = {
            showNewItemPopup: false,
            showSettingsPopup: false,
            listHandler: new ListHandler([], [], this.update),
            isFileOpen: false,
        };

        // Bind all the methods
        this.toggleNewItemPopup = this.toggleNewItemPopup.bind(this);
        this.update = this.update.bind(this);
        this.newFile = this.newFile.bind(this);
        this.openFile = this.openFile.bind(this);
        this.openFileFromPath = this.openFileFromPath.bind(this);
        this.toggleSettingsPopup = this.toggleSettingsPopup.bind(this);

        FileWriterRemote.getLastOpenedFile((contents) => {
            this.setState({
                listHandler: new ListHandler(contents.items, contents.order, this.update),
                isFileOpen: true
            });
        });

        this.listenForShortcuts();
    }

    /**
     * Listens for shortcuts sent from the main process.
     */
    listenForShortcuts() {
        window.require("electron").ipcRenderer.on("open", () => this.openFile());

        window.require("electron").ipcRenderer.on("open-from-path", (event, arg) => this.openFileFromPath(arg));

        window.require("electron").ipcRenderer.on("new", () => this.newFile());

        window.require("electron").ipcRenderer.on("settings", () => this.toggleSettingsPopup());
    }

    /**
     * Set a new instance of the list handler.
     *
     * @param handler - List handler's new instance.
     */
    update(handler){
        this.setState({listHandler: handler});

        if (!this.state.isFileOpen)
            this.setState({isFileOpen: true});
    }

    /**
     * Opens a dialog to create a new list file.
     */
    newFile() {
        FileWriterRemote.new(() => {
            this.setState({
                listHandler: new ListHandler([], [], this.update),
                isFileOpen: true
            });
        });
    }

    /**
     * Opens a dialog to open an existing list file.
     */
    openFile() {
        FileWriterRemote.open((contents) => {
            this.setState({
                listHandler: new ListHandler(contents.items, contents.order, this.update),
                isFileOpen: true
            });
        })
    }

    /**
     * Opens a file from a given path.
     *
     * @param filePath - Path of file to open
     */
    openFileFromPath(filePath) {
        FileWriterRemote.getFromPath(filePath, (err, contents) => {
            this.setState({
                listHandler: new ListHandler(contents.items, contents.order, this.update),
                isFileOpen: true
            });
        })
    }

    /**
     * Show or hides the add new item input.
     */
    toggleNewItemPopup() {
        this.setState({
            showNewItemPopup: !this.state.showNewItemPopup
        });
    }

    /**
     * Show or hides the settings window.
     */
    toggleSettingsPopup() {
        this.setState({
            showSettingsPopup: !this.state.showSettingsPopup
        });
    }

    /**
     * @inheritDoc
     */
    render() {
        let blurState = this.state.showNewItemPopup ? "blur" : "null-blur";

        return (
            <main className="background">
                <NewItemPopup
                    popupState={this.state.showNewItemPopup}
                    togglePopup={this.toggleNewItemPopup}
                    listHandler={this.state.listHandler}
                />

                <div
                    className={blurState}
                    id="overlay"
                    onClick={this.toggleNewItemPopup}
                />

                <TitleBar
                    newFile={this.newFile}
                    openFile={this.openFile}
                    openSettings={this.toggleSettingsPopup}
                    blurState={blurState}
                />

                <List
                    listHandler={this.state.listHandler}
                    isFileOpen={this.state.isFileOpen}
                    openFileFromPath={this.openFileFromPath}
                    update={this.update}
                    blurState={blurState}

                />

                {
                    this.state.isFileOpen &&
                    <div
                        onClick={this.toggleNewItemPopup}
                        id="new-item-btn"
                        className={this.state.showNewItemPopup ? "floating-btn closed" : "floating-btn open"}
                    >
                        <i className="fas fa-plus"/>
                    </div>
                }

                <NewItemPopup
                    popupState={this.state.showNewItemPopup}
                    togglePopup={this.toggleNewItemPopup}
                    listHandler={this.state.listHandler}
                />

                {
                    this.state.showSettingsPopup &&
                    <Settings popupState={this.state.showSettingsPopup} togglePopup={this.toggleSettingsPopup} />
                }
            </main>
        );
    }
}
