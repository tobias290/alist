import React from 'react';
import PropTypes from 'prop-types';
import WindowRemote from "../js/remotes/WindowRemote";

import "../css/title-bar.css";

/**
 * Title bar component with buttons that open/create new file as well as minimise and close the application.
 */
export default class TitleBar extends React.Component {
    /**
     * @inheritDoc
     */
    render() {
        return (
            <div id="title-bar" className={this.props.blurState}>
                <div id="options">
                    <div onClick={this.props.newFile}>
                        <div title="New (Ctrl + N)">
                            <i className="fas fa-file" />
                        </div>
                    </div>
                    <div onClick={this.props.openFile}>
                        <div title="Open (Ctrl + O)">
                            <i className="fas fa-folder-open" />
                        </div>
                    </div>
                    <div className="separator">|</div>
                    <div onClick={this.props.openSettings}>
                        <div title="Settings (Ctrl + S)">
                            <i className="fas fa-cog" />
                        </div>
                    </div>
                </div>

                <span id="title"><img src={require("../images/logo-light.svg")} alt="alist" /></span>

                <div id="buttons-right">
                    <div onClick={WindowRemote.quit}>
                        <i className="fas fa-times bar-icon red" title="Close" />
                    </div>
                    <div onClick={WindowRemote.minimise}>
                        <i className="fas fa-minus bar-icon" title="Minimise" />
                    </div>
                    {/* TODO: sort out resizing widths */}
                    {/*<div onClick={() => WindowRemote.getWidth() < WindowRemote.resizeToMaxWidth() ? WindowRemote.resizeToMaxWidth() : WindowRemote.resizeToMinWidth()}>*/}
                        {/*<i className="fas fa-arrows-alt-h bar-icon" title="Widen" />*/}
                    {/*</div>*/}
                    {/*<div onClick={WindowRemote.openDevWindow}>*/}
                        {/*<i className="fas fa-wrench bar-icon red" style={{color: "red"}} />*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }
}

TitleBar.propTypes = {
    newFile: PropTypes.func,
    openFile: PropTypes.func,
    openSettings: PropTypes.func,
    blurState: PropTypes.string,
};
