import React from 'react';
import PropTypes from 'prop-types';

import ToggleSwitch from "./controls/ToggleSwitch";

import "../css/settings.css";

/**
 * Setting window to change various application settings.
 */
export default class Settings extends React.Component {

    toggleClick(state) {
        console.log(state ? "Active" : "Not Active");
    }

    /**
     * @inheritDoc
     */
    render() {
        return (
            <div id="settings">
                <button className="close-btn" onClick={this.props.togglePopup}><i className="fas fa-times" /></button>
                <div className="section" style={{borderTop: "1px solid lightgray"}}>
                    <span className="information">Launch on startup</span>
                    <ToggleSwitch onStateChange={this.toggleClick} />
                </div>
                <div className="section">
                    <span className="information">Minimise to tray on close</span>
                    <ToggleSwitch onStateChange={this.toggleClick} />
                </div>
            </div>
        );
    }
}

Settings.propTypes = {
    popupState: PropTypes.bool,
    togglePopup: PropTypes.func,
};


