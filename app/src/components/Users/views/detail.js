import React from 'react';

export default ({ user }) => (
    <div>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Key</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(user).map((key, index) => (
                    <tr key={index}>
                        <th scope="row">{key}</th>
                        <td>
                            {user[key]}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
