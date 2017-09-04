import React from 'react';

import { Form, Control } from 'react-redux-form';

export default ({ error, handleChange, handleUpdate, handleSubmit }) => (
    <Form model="user" onUpdate={form => handleUpdate(form)} onChange={values => handleChange(values)} onSubmit={values => handleSubmit(values)}>
        {error && <div className="alert alert-danger">{error.message}</div>}

        <div className="panel-body">
            <div className="row">
                <div className="form-group">
                    <label className="control-label">Username</label>
                    <Control.text model=".username" placeholder="Username" autoFocus />
                </div>
            </div>
        </div>

        <div className="panel-body">
            <div className="row">
                <div className="form-group">
                    <label className="control-label">Username</label>
                    <Control.text model=".password" type="password" placeholder="Password" />
                </div>
            </div>
        </div>
        <button className="btn btn-primary btn-lg btn-block" type="submit">
            Sign In
        </button>
    </Form>
);
