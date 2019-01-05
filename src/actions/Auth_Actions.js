
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';

import {
  AUTH_PHONE_SET,
  AUTH_COUNTRY_CODE_SET,
  AUTH_VERIFICATION_SET,

  AUTH_RESET,

  // login attempt
  PHONE_ENTRY_BEGIN,
  PHONE_ENTRY_SUCCESS,
  PHONE_ENTRY_FAIL,

  VERIFICATION_BEGIN,
  VERIFICATION_SUCCESS,
  VERIFICATION_FAIL
} from './types';

export const authPhoneSet = (phone) => {
  return { type: AUTH_PHONE_SET, payload: { phone } };
};

export const authCountryCodeSet = (country_code, call_code) => {
  return { type: AUTH_COUNTRY_CODE_SET, payload: { country_code, call_code } };
};

export const authVerificationSet = (verification) => {
  return { type: AUTH_VERIFICATION_SET, payload: { verification } };
};

export const authPhoneLogin = (phone, call_code) => {
  const formatted_phone = `+${call_code}${phone}`.replace(/\s/g, '');
  firebase.auth().signOut();

  return (dispatch) => {
    dispatch({ type: PHONE_ENTRY_BEGIN });
    firebase.auth().signInWithPhoneNumber(formatted_phone)
    .then(confirmation_function => {
      dispatch({ type: PHONE_ENTRY_SUCCESS, payload: { confirmation_function } });
      Actions.verifyCode();
    }) // save confirm result to use with the manual verification code)
    .catch(error => dispatch({ type: PHONE_ENTRY_FAIL, payload: { error } }));
    // Note: this catch may encompass errors beyond the login process itself
  };
};


export const authPhoneVerify = (code, confirmation_function, onProceed) => {
  return (dispatch) => {
    dispatch({ type: VERIFICATION_BEGIN });

    confirmation_function.confirm(code)
      .then(() => {
        dispatch({ type: VERIFICATION_SUCCESS });
        onProceed();
      }) // User is logged in){
      .catch(error => dispatch({ type: VERIFICATION_FAIL, payload: { error } }));
  };
};

export const resetAuth = () => {
  return { type: AUTH_RESET };
};

// execute logout & update logout attempt state accordingly
// (authentication status will be caught by the onAuthStateChanged listener )
export const logoutUser = () => {
  return (dispatch) => {
    dispatch({ type: CUSTOMER_DATA_RESET });

    firebase.auth().signOut()
    .then(() => console.log('succesful logout'))
    .catch((error) => console.log(error));
    // Note: this catch may encompass errors beyond the logout process itself
  };
};
