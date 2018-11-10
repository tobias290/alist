import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ListHandler from "../js/ListHandler";

import "../css/list.css";

/**
 * Component to display a single list item/
 */
export default class ListItem extends Component {
    constructor(props) {
        super(props);

        this.dragStart = this.dragStart.bind(this);
        this.dragOver = this.dragOver.bind(this);
        this.dragLeave = this.dragLeave.bind(this);
        this.drop = this.drop.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
    }

    /**
     * Called when an item has started to be dragged.
     *
     * @param event
     */
    dragStart(event) {
        this.props.setCurrentDraggedItemId(parseInt(event.target.id));
    }

    /**
     * Called when an item is being moved over by another item.
     *
     * @param event
     */
    dragOver(event) {
        if (this.props.currentDraggedItemId == null || this.props.currentDraggedItemId === this.props.item.id)
            return;

        if (event.preventDefault)
            event.preventDefault();

        if(event.pageY >= event.target.getBoundingClientRect().top + event.target.clientHeight / 2) {
            event.target.classList.add("over-bottom");
        } else{
            event.target.classList.add("over-top");
        }


    }

    /**
     * Called when an item is leaving another item after being dragged over it.
     *
     * @param event
     */
    dragLeave(event) {
        event.target.classList.remove("over-top");
        event.target.classList.remove("over-bottom");
    }

    /**
     * Called when an item is dropped after being dragged.
     *
     * @param event
     */
    drop(event) {
        if (event.preventDefault)
            event.preventDefault();

        // Reorders item to new position
        this.props.listHandler.reorder(this.props.currentDraggedItemId, this.props.position);

        event.target.classList.remove("over-top");
        event.target.classList.remove("over-bottom");


        this.props.setCurrentDraggedItemId(null);
    }

    /**
     * Called when the dragging process has finished.
     *
     * @param event
     */
    dragEnd(event) {
        event.target.classList.remove("over-top");
        event.target.classList.remove("over-bottom");
    }

    /**
     * @returns {*} - Returns check mark is item is complete or empty check circle is the item is not complete.
     */
    renderCorrectImage() {
        if (this.props.item.is_complete) {
            return (
                <img
                    src={require("../images/icons/check-circle.svg")}
                    className="check-icon complete"
                    alt="check"
                    onClick={() => this.props.listHandler.markItemComplete(this.props.item.id)}
                />
            );
        } else {
            return (
                <img
                    src={require("../images/icons/circle-o.svg")}
                    className="check-icon incomplete"
                    alt="check-o"
                    onClick={() => this.props.listHandler.markItemComplete(this.props.item.id)}
                />
            );
        }
    }

    /**
     * @inheritDoc
     */
    render(){
        if (!this.props.item.hasOwnProperty("id")) {
            // Return empty item at end to allow items to be moved to the end of the list
            return <li
                draggable={false}
                onDragStart={this.dragStart}
                onDragOver={this.dragOver}
                onDragLeave={this.dragLeave}
                onDrop={this.drop}
                onDragEnd={this.dragEnd}
            />;
        } else {
            return (
                <li
                    className={this.props.item.is_complete ? "complete" : "incomplete"}
                    id={this.props.item.id}
                    draggable={true}
                    onDragStart={this.dragStart}
                    onDragOver={this.dragOver}
                    onDragLeave={this.dragLeave}
                    onDrop={this.drop}
                    onDragEnd={this.dragEnd}
                >
                    <div className={this.props.item.notes !== null ? "has-note li-icons" : "no-note li-icons"}>
                        <div onClick={() => this.props.listHandler.deleteItem(this.props.item.id)}>
                            <span className="fa-layers fa-fw">
                                <i className="fas fa-circle"/>
                                <i className="fas fa-trash-alt"/>
                            </span>
                        </div>
                    </div>
                    {this.renderCorrectImage()}
                    <p id="todo-label" draggable={false}>{this.props.item.text}</p>
                    {this.props.item.notes != null && <p id="todo-note">{ /* Notes: */}{this.props.item.notes}</p>}
                </li>
            );
        }
    }
}

ListItem.propTypes = {
    position: PropTypes.number,
    item: PropTypes.object,
    listHandler: PropTypes.instanceOf(ListHandler),
    currentDraggedItemId: PropTypes.number,
    setCurrentDraggedItemId: PropTypes.func,
};