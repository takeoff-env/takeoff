import React, { Component } from 'react';

export default ({ onLogout }) => (
    <button onClick={() => onLogout()} className="btn btn-primary">
        <i className="pli-unlock icon-fw" />Logout
    </button>
);
