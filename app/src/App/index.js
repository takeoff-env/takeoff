/* global REDUX_DEV_TOOLS */
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import reducers from './reducers';
import api from '../services/api';

let createStoreWithMiddleware = applyMiddleware(thunkMiddleware, api)(createStore);

let store;
if (REDUX_DEV_TOOLS) {
    store = createStoreWithMiddleware(
        reducers,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    );
} else {
    createStoreWithMiddleware(reducers);
}

import View from './view';

export default ({ props }) => (
    <Router>
        <Provider store={store}>
            <View {...props} />
        </Provider>
    </Router>
);
