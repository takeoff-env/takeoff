import React, { Component, PropTypes } from 'react';
import Login from '../Login';
import Logout from '../Logout';
import { loginUser, logoutUser } from '../Login/actions';
import { Link } from 'react-router-dom';

import logo from './images/logo.png';

import classNames from 'classnames';

export default ({ dispatch, isAuthenticated, showingAdminMenu, onAdminClick }) => {
    let dropdownToggle = classNames('mega-dropdown-toggle', { open: showingAdminMenu });
    let dropdown = classNames('dropdown-menu mega-dropdown-menu', { show: showingAdminMenu, hide: !showingAdminMenu})

    return (
        <header id="navbar">
            <div id="navbar-container" className="boxed">
                <div className="navbar-header">
                    <Link to="/" className="navbar-brand">
                        <img src={logo} alt="Nifty Logo" className="brand-icon" />
                        <div className="brand-title">
                            <span className="brand-text">Takeoff</span>
                        </div>
                    </Link>
                </div>

                <div className="navbar-content clearfix">
                    <ul className="nav navbar-top-links pull-left">
                        <li>Hello</li>
                        <li>
                            <Link to="/">Home</Link>
                        </li>

                        {isAuthenticated && (
                            <li className="mega-dropdown">
                            <a href="#" className={dropdownToggle} onClick={onAdminClick}>
                                Admin Menu {showingAdminMenu ? <span>(open)</span> : null}
                            </a>
                            <div className={dropdown} onClick={onAdminClick}>
                                <div className="row">
                                    <div className="col-sm-4 col-md-3">
                                        <ul className="list-unstyled">
                                            <li className="dropdown-header">
                                                <i className="demo-pli-file icon-fw" /> Pages
                                            </li>
                                            <li>
                                                <Link to="/users">Users</Link>
                                            </li>
                                            <li>
                                                <a href="#">Search Result</a>
                                            </li>
                                            <li>
                                                <a href="#">FAQ</a>
                                            </li>
                                            <li>
                                                <a href="#">Sreen Lock</a>
                                            </li>
                                            <li>
                                                <a href="#" className="disabled">
                                                    Disabled
                                                </a>
                                            </li>{' '}
                                        </ul>
                                    </div>
                                    <div className="col-sm-4 col-md-3">
                                        <ul className="list-unstyled">
                                            <li className="dropdown-header">
                                                <i className="demo-pli-mail icon-fw" /> Mailbox
                                            </li>
                                            <li>
                                                <a href="#">
                                                    <span className="pull-right label label-danger">Hot</span>Indox
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#">Read Message</a>
                                            </li>
                                            <li>
                                                <a href="#">Compose</a>
                                            </li>
                                        </ul>
                                        <p className="pad-top mar-top bord-top text-sm">
                                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus
                                            et magnis dis parturient montes.
                                        </p>
                                    </div>
                                    <div className="col-sm-4 col-md-3">
                                        <ul className="list-unstyled">
                                            <li>
                                                <a href="#" className="media mar-btm">
                                                    <span className="badge badge-success pull-right">90%</span>
                                                    <div className="media-left">
                                                        <i className="demo-pli-data-settings icon-2x" />
                                                    </div>
                                                    <div className="media-body">
                                                        <p className="text-semibold text-main mar-no">Data Backup</p>
                                                        <small className="text-muted">This is the item description</small>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="media mar-btm">
                                                    <div className="media-left">
                                                        <i className="demo-pli-support icon-2x" />
                                                    </div>
                                                    <div className="media-body">
                                                        <p className="text-semibold text-main mar-no">Support</p>
                                                        <small className="text-muted">This is the item description</small>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="media mar-btm">
                                                    <div className="media-left">
                                                        <i className="demo-pli-computer-secure icon-2x" />
                                                    </div>
                                                    <div className="media-body">
                                                        <p className="text-semibold text-main mar-no">Security</p>
                                                        <small className="text-muted">This is the item description</small>
                                                    </div>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="media mar-btm">
                                                    <div className="media-left">
                                                        <i className="demo-pli-map-2 icon-2x" />
                                                    </div>
                                                    <div className="media-body">
                                                        <p className="text-semibold text-main mar-no">Location</p>
                                                        <small className="text-muted">This is the item description</small>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-sm-12 col-md-3">
                                        <p className="dropdown-header">
                                            <i className="demo-pli-file-jpg icon-fw" /> Gallery
                                        </p>
                                        <ul className="list-unstyled list-inline text-justify">
                                            <li className="pad-btm">
                                                <img src="img//thumbs/mega-menu-2.jpg" alt="thumbs" />
                                            </li>
                                            <li className="pad-btm">
                                                <img src="img//thumbs/mega-menu-3.jpg" alt="thumbs" />
                                            </li>
                                            <li className="pad-btm">
                                                <img src="img//thumbs/mega-menu-1.jpg" alt="thumbs" />
                                            </li>
                                            <li className="pad-btm">
                                                <img src="img//thumbs/mega-menu-4.jpg" alt="thumbs" />
                                            </li>
                                            <li className="pad-btm">
                                                <img src="img//thumbs/mega-menu-5.jpg" alt="thumbs" />
                                            </li>
                                            <li className="pad-btm">
                                                <img src="img//thumbs/mega-menu-6.jpg" alt="thumbs" />
                                            </li>
                                        </ul>
                                        <a href="#" className="btn btn-sm btn-block btn-default">
                                            Browse Gallery
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>)}
                    </ul>
                    <ul className="nav navbar-top-links pull-right">
                        {isAuthenticated && (
                            <li id="dropdown-user" className="dropdown">
                                <a href="#" data-toggle="dropdown" className="dropdown-toggle text-right">
                                    <span className="ic-user pull-right">
                                        <i className="pli-male" />
                                    </span>
                                    <div className="username hidden-xs">John Doe</div>
                                </a>

                                <div className="dropdown-menu dropdown-menu-md dropdown-menu-right panel-default">
                                    <ul className="head-list">
                                        {isAuthenticated && (
                                            <li>
                                                <Logout onLogout={() => dispatch(logoutUser())} />
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </li>
                        )}
                    </ul>
                    {(isAuthenticated && (
                        <div className="pad-all text-right">
                            <Logout onLogout={() => dispatch(logoutUser())} />
                        </div>
                    )) || (
                        <div className="pad-all text-right">
                            <Link className="btn btn-primary" to="/login">
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
