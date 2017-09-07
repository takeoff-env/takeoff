import React, { Component, PropTypes } from 'react';
import Login from '../Login';
import Logout from '../Logout';
import { loginUser, logoutUser } from '../Login/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import logo from './images/logo.png';

import View from './view';

class NavBar extends Component {
    constructor(props) {
        super(...props);

        this.state = {
            showingAdminMenu: false
        };
    }

    onAdminClick(event) {
        this.setState({ showingAdminMenu: !this.state.showingAdminMenu });
    }

    render() {
        const { isAuthenticated, dispatch } = this.props;
        const { showingAdminMenu } = this.state;
        return (
            <View
                dispatch={dispatch}
                isAuthenticated={isAuthenticated}
                showingAdminMenu={showingAdminMenu}
                onAdminClick={this.onAdminClick.bind(this)}
            />
        );
    }
}

function mapStateToProps(state) {
    const { auth } = state;
    const { isAuthenticated } = auth;

    return {
        isAuthenticated
    };
}

export default withRouter(connect(mapStateToProps)(NavBar));
