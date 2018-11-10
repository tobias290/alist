import React from 'react';
import ReactDOM from 'react-dom';
import './render/css/index.css';
import App from './render/components/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
