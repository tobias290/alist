import React from 'react';
import PropTypes from 'prop-types';

import ListItem from "./ListItem";


import Remote from "../js/remotes/Remote";
import FileWriterRemote from "../js/remotes/FileWriterRemote";

import ListHandler from "../js/ListHandler";

import "../css/list.css";

/**
 * Displays the list of items.
 */
export default class List extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDraggedItemId: null,
        };

        this.setCurrentDraggedItemId = this.setCurrentDraggedItemId.bind(this);
        this.openFileByDrop = this.openFileByDrop.bind(this);
    }

    /**
     * Sets the id of the current element being dragged.
     *
     * @param id - Id of dragged element
     */
    setCurrentDraggedItemId(id) {
        this.setState({
            currentDraggedItemId: id
        })
    }

    /**
     * @returns {*} - Returns a message for when no items are currently in the list.
     */
    static renderEmptyListMessage() {
        return (
            <div>
                <span className="fa-layers fa-fw message">
                    <i className="far fa-file-alt" />
                </span>
                <span className="message">No items</span>
            </div>
        );
    }

    /**
     * @returns {*} - Returns a message for when a file is not yet open.
     */
    static renderNoOpenListMessage() {
        return <span className="message">Open or create a new list to start</span>;
    }

    /**
     * @returns {*} - Returns either the list of the appropriate message is the list is empty.
     */
    renderMessageOrList() {
        // Check to see if a file is open
        if (this.props.isFileOpen) {
            if (this.props.listHandler.getList().length === 0) {
                // File is open but has no items
                return List.renderEmptyListMessage();
            } else {
                // File is open and has items
                return this.props.listHandler.getOrder().map((id, i) => {
                    return (
                        <ListItem
                            position={i}
                            item={this.props.listHandler.getItemById(id)}
                            listHandler={this.props.listHandler}
                            currentDraggedItemId={this.state.currentDraggedItemId}
                            setCurrentDraggedItemId={this.setCurrentDraggedItemId}
                        />
                    );
                });
            }
        } else {
            // No file is open
            return List.renderNoOpenListMessage();
        }
    }

    /**
     * Allows the user to drag a file over the list to open it.
     *
     * @param event
     */
    openFileByDrop(event) {
        event.preventDefault();

        // If the dragged item is not a file or is the wrong file type or is the same file that is already opened then it will return
        if (event.dataTransfer.files.length === 0 || event.dataTransfer.files[0].path.split('.').pop() !== "todo" || Remote.getGlobal("file") === event.dataTransfer.files[0].path)
            return;


        this.props.openFileFromPath(event.dataTransfer.files[0].path);
    }

    /**
     * @inheritDoc
     */
    render() {
        // While the data hasn't loaded load something else otherwise it crashes
        return (
            <div id="todo-container" className={this.props.blurState} onDragOver={event => event.preventDefault()} onDrop={this.openFileByDrop}>
                <ul id="todo-list">
                    {this.renderMessageOrList()}
                    {/* Render empty item at end to allow items to be moved to the end of the list */}
                    <ListItem
                        position={this.props.listHandler.getList().length + 1}
                        item={{}}
                        listHandler={this.props.listHandler}
                        currentDraggedItemId={this.state.currentDraggedItemId}
                        setCurrentDraggedItemId={this.setCurrentDraggedItemId}
                    />
                </ul>
            </div>
        );
    }
}

List.propTypes = {
    blurState: PropTypes.string,
    isFileOpen: PropTypes.bool,
    listHandler: PropTypes.instanceOf(ListHandler),
    openFileFromPath: PropTypes.func,
    update: PropTypes.func,
};