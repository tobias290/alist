import React from 'react';
import PropTypes from 'prop-types';

import ListHandler from "../js/ListHandler";

import "../css/new-item-pop-up.css";

/**
 * Displays a form component to create a new list item.
 */
export default class NewItemPopup extends React.Component {
    /**
     * @inheritDoc
     */
    constructor(props) {
        super(props);

        this.state = {
            itemName: "",
            itemNotes: null
        };

        // Create item ref so methods can access the DOM elements
        this.itemName = React.createRef();
        this.itemNotes = React.createRef();

        // Bind the methods
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNotesChange = this.handleNotesChange.bind(this);
        this.addItem = this.addItem.bind(this);
    }

    /**
     * Updates the state which holds the value of the item's name.
     *
     * @param {object} e - Event
     */
    handleNameChange(e) {
        this.setState({itemName: e.target.value});
    }

    /**
     * Updates the state which holds the value of the item's notes.
     *
     * @param {object} e - Event
     */
    handleNotesChange(e) {
        this.setState({itemNotes: e.target.value});
    }

    /**
     * Creates and adds a new item to the list
     */
    addItem() {
        if(this.state.itemName !== "") {
            // Create & add new item
            this.props.listHandler.addItem({
                "id": this.props.listHandler.getNextAvailableId(),
                "text": this.state.itemName,
                "is_complete": false,
                "notes": this.state.itemNotes
            });

            // Reset state
            this.setState({
                itemName: "",
                itemNotes: null
            });

            // Clear inputs
            this.itemName.current.value = "";
            this.itemNotes.current.value = "";

            // Close pop-up
            this.props.togglePopup();
        } else {
            // TODO: add error message
        }
    }

    /**
     * @inheritDoc
     */
    render() {
        return (
            <div id="pop-up" className={this.props.popupState ? "open": "closed"}>
                <button className="close-btn" onClick={this.props.togglePopup}><i className="fas fa-times" /></button>

                <div id="input-panel">
                    <input id="todo-text" placeholder="What do you need to do? *" onChange={this.handleNameChange} ref={this.itemName} />
                    <div id="separator" />
                    <textarea id="todo-notes" placeholder="Notes: (Optional)" onChange={this.handleNotesChange} ref={this.itemNotes} />
                </div>
                <button id="add-btn" onClick={this.addItem} disabled={this.state.itemName === "" ? "disabled": ""}>add</button>
            </div>
        );
    }
}

NewItemPopup.propTypes = {
    popupState: PropTypes.bool,
    togglePopup: PropTypes.func,
    listHandler: PropTypes.instanceOf(ListHandler)
};