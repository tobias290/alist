import FileWriterRemote from "./remotes/FileWriterRemote";

/**
 * Handles all functionality relating to editing list data
 */
export default class ListHandler {
    /**
     * ListHandler constructor.
     *
     * @param {array} items - List of item objects.
     * @param {array} order - List of item id's in the order to display them.
     * @param {function} updater - Updater which is called to update the state.
     */
    constructor(items, order, updater) {
        /**
         * @private
         * @type {Array}
         */
        this.items = items;

        /**
         * @private
         * @type {Array}
         */
        this.order = order;

        /**
         * @private
         * @type {Function}
         */
        this.updater = updater;
    }

    /**
     * @returns {{items: (Array|*), order: (Array|*)}} - Returns the data in the correct format the file format.
     */
    getUpdateFormat() {
        return {
            "items": this.items,
            "order": this.order,
        }
    }

    /**
     * Updates the current data and updates the state.
     */
    update() {
        // Saves the data
        FileWriterRemote.write(this.getUpdateFormat(), () => {
            // Loads the data asynchronously after the new data has been saved
            FileWriterRemote.get((err, json) => {
                if (err) return console.log(err);

                this.updater(new ListHandler(json.items, json.order, this.updater));
            })
        });
    }

    /**
     * Gets a item by its id.
     *
     * @param {number} id - id's value.
     * @returns {object|null} - Returns the found object or null if no object was found.
     */
    getItemById(id) {
        for (let item of this.items)
            if (item.id === id)
                return item;
        return null;
    }

    /**
     * @returns {Array|*} - Returns the order array.
     */
    getOrder() {
        return this.order;
    }

    /**
     * @returns {Array|*} - Returns the list of item objects.
     */
    getList() {
        return this.items;
    }

    /**
     * Check's the latest id and returns the next number after it to keep all IDs unique.
     *
     * @returns {number} - Returns the next available id.
     */
    getNextAvailableId() {
        return this.items.length !== 0 ? this.items[this.items.length - 1].id + 1 : 0
    }

    /**
     * Adds a new item to the list.
     *
     * @param {object} item - Item object to add.
     */
    addItem(item) {
        this.items.push(item);
        this.order.push(item.id);

        this.update();
    }

    /**
     * Deletes a item in the list.
     *
     * @param id - Item's id.
     */
    deleteItem(id) {
        // Loops over all the items and deletes the correct object
        for (let i in this.items) {
            if (this.items.hasOwnProperty(i) && this.items[i].id === id) {
                delete this.items[i];
            }
        }

        // Loops over orders list and deletes it id from the list
        for (let i in this.order) {
            if (this.order.hasOwnProperty(i) && this.order[i] === id) {
                delete this.order[i];
            }
        }

        // Updates the state
        this.update();
    }

    /**
     * Marks an item as complete or not complete.
     *
     * @param id - Item's id.
     */
    markItemComplete(id) {
        // Changes the item complete state to the opposite of it current state
        this.getItemById(id).is_complete = !this.getItemById(id).is_complete;

        // Updates the state
        this.update();
    }

    /**
     * Gets a position of an item from its id.
     *
     * @param {number} id - ID of the item .
     * @returns {number|null} - Returns it position in the list or null if the id doesn't exist
     */
    getOrderPositionFromId(id) {
        for (let i in this.order)
            if (this.order.hasOwnProperty(i) && id === this.order[i])
                return parseInt(i);
        return null;
    }

    /**
     * Moves the current item to a new position in the list.
     *
     * @param {number} itemId - ID of the item to move .
     * @param {number} newPosition - New index to move the item to.
     */
    reorder(itemId, newPosition) {
        if (this.order.length === 0) return;

        for (let i in this.order)
            if (this.order.hasOwnProperty(i) && itemId === this.order[i])
                this.order.splice(newPosition, 0, this.order.splice(i, 1)[0]);

        this.update();
    }
}