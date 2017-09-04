// actions.js

// The middleware to call the API for quotes
import { CALL_API } from '../../services/api';

export const USERS_REQUEST = 'USERS_REQUEST';
export const USERS_SUCCESS = 'USERS_SUCCESS';
export const USERS_FAILURE = 'USERS_FAILURE';

export const USERS_CREATE = 'USERS_CREATE';
export const USERS_CREATE_SUCCESS = 'USERS_CREATE_SUCCESS';
export const USERS_CREATE_FAILURE = 'USERS_CREATE_FAILURE';


// Uses the API middlware to get a quote
export function fetchUsers() {
    return {
        [CALL_API]: {
            endpoint: 'users',
            authenticated: true,
            types: [USERS_REQUEST, USERS_SUCCESS, USERS_FAILURE]
        }
    };
}

export function createUser(user) {
  return {
      [CALL_API]: {
          endpoint: 'users',
          authenticated: true,
          types: [USERS_CREATE, USERS_CREATE_SUCCESS, USERS_CREATE_FAILURE],
          options: {
            method: 'POST',
            body: JSON.stringify(user)
          }
      }
  };
}
