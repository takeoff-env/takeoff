import React, { Component } from 'react';

import View from './view';

export default class Login extends Component {
    handleUpdate() {}

    handleChange() {}

    handleSubmit({ username, password }) {
        this.props.onLogin({ username, password });
    }

    render() {
        const { error } = this.props;

        return (
            <main>
                <div className="page-head">
                    <div className="page-title">
                        <h1 className="page-header text-overflow">Login</h1>
                    </div>
                </div>
                <div className="page-content">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="panel">
                                <View
                                    error={error}
                                    handleUpdate={this.handleUpdate.bind(this)}
                                    handleChange={this.handleChange.bind(this)}
                                    handleSubmit={this.handleSubmit.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

// class Login extends Component {
//     constructor() {
//         super();
//         this.onSubmit = this.onSubmit.bind(this);
//         this.onChange = this.onChange.bind(this);

//         this.state = {
//             username: '',
//             password: ''
//         };
//     }

//     onSubmit(ev) {
//         ev.preventDefault();
//         const { username, password } = this.state;
//         this.props.onLogin({ username, password });
//     }

//     onChange(event) {
//         const { name, value } = event.target;
//         this.setState({ [name]: value, errors: [] });
//     }

//     render() {
//         const { error } = this.props;

//         return (
//             <div className="cls-container">
//                 <div className="cls-content">
//                     <div className="cls-content-sm panel">
//                         <div className="panel-body">
//                             <div className="mar-ver pad-btm">
//                                 <h1 className="h3">Account Login</h1>
//                                 <p>Sign In to your account</p>
//                             </div>

//                             {error && (
//                                 <div className="alert alert-danger">
//                                     {error.statusCode === 400 && 'There has been a validation error, please check your username and password'}
//                                     {error.statusCode === 401 && error.message}
//                                     {(error.statusCode < 400 || error.statusCode > 401) && error.message}
//                                 </div>
//                             )}

//                             <form onSubmit={this.onSubmit} onChange={this.onChange}>
//                                 <div className="panel-body">
//                                     <div className="row">
//                                         <div className="form-group">
//                                             <label className="control-label">Username</label>
//                                             <input type="text" name="username" className="form-control" placeholder="Username" autoFocus value={this.state.username} />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="panel-body">
//                                     <div className="row">
//                                         <div className="form-group">
//                                             <label className="control-label">Password</label>
//                                             <input type="password" name="password" className="form-control" placeholder="Password" value={this.state.password} />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="panel-body">
//                                     <div className="row">
//                                         <div className="checkbox pad-btm text-left">
//                                             <input id="form-checkbox" className="magic-checkbox" type="checkbox" />
//                                             <label htmlFor="form-checkbox">Remember me</label>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <button className="btn btn-primary btn-lg btn-block" type="submit">
//                                     Sign In
//                                 </button>
//                             </form>
//                         </div>
//                         <div className="pad-all">
//                             <a href="#" className="btn-link mar-rgt">
//                                 Forgot password ?
//                             </a>
//                             <a href="#" className="btn-link mar-lft">
//                                 Create a new account
//                             </a>

//                             <div className="media pad-top bord-top">
//                                 <div className="pull-right">
//                                     <a href="#" className="pad-rgt">
//                                         <i className="psi-facebook icon-lg text-primary" />
//                                     </a>
//                                     <a href="#" className="pad-rgt">
//                                         <i className="psi-twitter icon-lg text-info" />
//                                     </a>
//                                     <a href="#" className="pad-rgt">
//                                         <i className="psi-google-plus icon-lg text-danger" />
//                                     </a>
//                                 </div>
//                                 <div className="media-body text-left text-bold text-main">Login with</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }

// export default Login;
