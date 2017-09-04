export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

function requestLogin(credentials) {
    return {
        type: LOGIN_REQUEST,
        isFetching: true,
        isAuthenticated: false,
        credentials
    };
}

function receiveLogin(authentication) {
    return {
        type: LOGIN_SUCCESS,
        isFetching: false,
        isAuthenticated: true,
        token: authentication.token
    };
}

function requestLogout() {
    return {
        type: LOGOUT_REQUEST,
        isFetching: true,
        isAuthenticated: true
    };
}

function receiveLogout() {
    return {
        type: LOGOUT_SUCCESS,
        isFetching: false,
        isAuthenticated: false
    };
}

function loginError(error) {
    return {
        type: LOGIN_FAILURE,
        isFetching: false,
        isAuthenticated: false,
        error
    };
}

export function loginUser({ username, password }) {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accepts: 'application/json'
        },
        body: JSON.stringify({ username, password })
    };

    return dispatch => {
        // We dispatch requestLogin to kickoff the call to the API
        dispatch(requestLogin({ username, password }));

        return fetch('/api/auth/admin', config)
            .then(response => response.json().then(authentication => ({ authentication, response })))
            .then(({ authentication, response }) => {
                if (!response.ok) {
                    // If there was a problem, we want to
                    // dispatch the error condition
                    dispatch(loginError(authentication));
                    return Promise.reject(authentication);
                } else {
                    // If login was successful, set the token in local storage
                    sessionStorage.setItem('token', authentication.token);
                    // Dispatch the success action
                    dispatch(receiveLogin(authentication));
                }
            })
            .catch(err => console.log(err, err.stack));
    };
}

export function logoutUser() {
    return dispatch => {
        dispatch(requestLogout());
        sessionStorage.removeItem('token');
        dispatch(receiveLogout());
    };
}
