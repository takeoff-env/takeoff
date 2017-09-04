import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Link, withRouter } from 'react-router-dom';
import { fetchUsers } from './actions';

import List from './views/list';
import Form from './views/form';
import Detail from './views/detail';

class Users extends Component {
    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(fetchUsers());
    }

    handleUpdate() {}

    handleChange() {}

    handleSubmit({ username, password }) {
        this.props.onLogin({ username, password });
    }

    render() {
        const { users } = this.props;

        return (
            <main>
                <div className="page-head">
                    <div className="page-title">
                        <h1 className="page-header text-overflow">Users</h1>
                        <div className="searchbox">
                            <div className="input-group custom-search-form">
                                <input type="text" className="form-control" placeholder="Search.." />
                                <span className="input-group-btn">
                                    <button className="text-muted" type="button">
                                        <i className="demo-pli-magnifi-glass" />
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>

                    <ol className="breadcrumb">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li className="active">Users</li>
                    </ol>
                </div>

                <div className="page-content">
                    <div className="row">
                        <Switch>
                            <Route exact path="/users" render={props => <List {...props} users={users.users} />} />
                            <Route
                                exact
                                path="/users/add"
                                render={props => (
                                    <Form
                                        {...props}
                                        handleUpdate={this.handleUpdate.bind(this)}
                                        handleChange={this.handleChange.bind(this)}
                                        handleSubmit={this.handleSubmit.bind(this)}
                                    />
                                )}
                            />
                            <Route
                                path="/users/:userId"
                                render={props => {
                                    return <Detail {...props} user={users.users.find(u => props.match.params.userId)} />;
                                }}
                            />
                        </Switch>
                    </div>
                </div>
            </main>
        );
    }
}

function mapStateToProps(state) {
    const { auth, users } = state;
    const { isAuthenticated, error } = auth;

    return {
        users,
        isAuthenticated,
        error
    };
}

export default withRouter(connect(mapStateToProps)(Users));
