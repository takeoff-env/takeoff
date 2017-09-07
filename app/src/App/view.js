import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link, Switch, Redirect, withRouter } from 'react-router-dom';

import Login from '../components/Login';
import { loginUser } from '../components/Login/actions';
import NavBar from '../components/NavBar';
import Users from '../components/Users';

// Mocks
const Home = () => <h1>Home</h1>;
const WillMatch = () => <h1>WillMatch</h1>;
const NoMatch = () => <h1>NoMatch</h1>;

class App extends Component {
    render() {
        const { dispatch, isAuthenticated, error } = this.props;
        return (
            <main>
                <NavBar isAuthenticated={isAuthenticated} dispatch={dispatch} {...this.props} />
                <div className="boxed">
                    <div id="content-container">
                        <Switch>
                            <Route path="/" exact component={Home} />
                            <Route
                                path="/login"
                                render={props => (
                                    <Login
                                        {...props}
                                        error={error}
                                        onLogin={credentials => dispatch(loginUser(credentials))}
                                    />
                                )}
                            />
                            <Route path="/users" component={Users} />
                            <Route component={NoMatch} />
                        </Switch>
                    </div>
                </div>
            </main>
        );
    }
}

function mapStateToProps(state) {
    const { auth } = state;
    const { isAuthenticated, error } = auth;

    return {
        isAuthenticated,
        error
    };
}

export default withRouter(connect(mapStateToProps)(App));
