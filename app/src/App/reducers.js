import { combineReducers } from 'redux';

import auth from '../components/Login/reducers';
import users, { initialUserState } from '../components/Users/reducers';

import { combineForms, createForms } from 'react-redux-form';

const { user, forms } = createForms({ user: initialUserState });
export default combineReducers({
    auth,
    users,
    user,
    forms
});
