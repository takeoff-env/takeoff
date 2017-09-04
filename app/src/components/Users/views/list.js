import React from 'react';
import {Link} from 'react-router-dom';

export default ({users}) => (
    <div className="col-sm-12">
        <div className="panel">
            <div className="panel-heading">
                <h3 className="panel-title">Users</h3>
            </div>

            <Link to="/users/add">Add New User</Link>

            {users && (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th>Display Name</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td><Link to={`/users/${user.id}`}>{user.username}</Link></td>
                                <td>{user.displayName}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {!users && (
                <div>
                    <h3>No Users Found</h3>
                </div>
            )}
        </div>
    </div>
);
