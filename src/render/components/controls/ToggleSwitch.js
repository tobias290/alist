import React from 'react';
import PropTypes from 'prop-types';

import "../../css/controls/toggle-switch.css";

/**
 * Toggle switch component for switch between 2 states.
 */
export default class ToggleSwitch extends React.Component {
    /**
     * ToggleSwitch constructor.
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            isActive: false,
        };

        this.onStateChange = this.onStateChange.bind(this);
    }

    /**
     * Called then the toggle switch is toggled.
     */
    onStateChange() {
        this.setState({
            isActive: !this.state.isActive,
        },
            () => this.props.onStateChange(this.state.isActive)
        );
    }

    /**
     * @inheritDoc
     */
    render() {
        return (
            <label className="switch">
                <input type="checkbox" />
                <span className="slider round" onClick={this.onStateChange} />
            </label>
        );
    }
}

ToggleSwitch.propTypes = {
    startState: PropTypes.bool,
    onStateChange: PropTypes.func,
};


