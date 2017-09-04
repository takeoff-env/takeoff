import { USERS_REQUEST, USERS_SUCCESS, USERS_FAILURE } from './actions';

export const initialUserState = {
  username: '',
  password: '',
  displayName: '',
  role: ''
}

// The quotes reducer
export default function users(
    state = {
        isFetching: false,
        users: []
    },
    action
) {
    switch (action.type) {
        case USERS_REQUEST:
            return Object.assign({}, state, {
                isFetching: true
            });
        case USERS_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                users: action.response,
                authenticated: action.authenticated || false
            });
        case USERS_FAILURE:
            return Object.assign({}, state, {
                isFetching: false
            });
        default:
            return state;
    }
}
