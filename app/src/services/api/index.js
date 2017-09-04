const BASE_URL = '//localhost/api/';

function callApi({ endpoint, options, authenticated }) {
    let token = sessionStorage.getItem('token') || null;
    let config = Object.assign(
        {},
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accepts: 'application/json'
            }
        },
        options
    );

    if (authenticated && token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(BASE_URL + endpoint, config)
        .then(response => response.json().then(json => ({ json, response })))
        .then(({ json, response }) => {
            if (!response.ok) {
                return Promise.reject(json);
            }

            return json;
        })
        .catch(err => console.log(err));
}

export const CALL_API = Symbol('Call API');

export default store => next => action => {
    const callAPI = action[CALL_API];

    // So the middleware doesn't get applied to every single action
    if (typeof callAPI === 'undefined') {
        return next(action);
    }

    let { endpoint, options, types, authenticated } = callAPI;

    const [requestType, successType, errorType] = types;

    // Passing the authenticated boolean back in our data will let us distinguish between normal and secret quotes
    return callApi({ endpoint, options, authenticated }).then(
        response =>
            next({
                response,
                authenticated,
                type: successType
            }),
        error =>
            next({
                error: error.message || 'There was an error.',
                type: errorType
            })
    );
};
