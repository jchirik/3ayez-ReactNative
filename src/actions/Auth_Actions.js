
import firebase from 'react-native-firebase';
import { Platform, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { AppEventsLogger } from 'react-native-fbsdk';

import {
  AUTH_PHONE_SET,
  AUTH_COUNTRY_CODE_SET,
  AUTH_VERIFICATION_SET,

  AUTH_INIT,

  // login attempt
  PHONE_ENTRY_BEGIN,
  PHONE_ENTRY_SUCCESS,
  PHONE_ENTRY_FAIL,

  VERIFICATION_BEGIN,
  VERIFICATION_SUCCESS,
  VERIFICATION_FAIL,

  CUSTOMER_DATA_RESET,

  GUEST_LOGIN_BEGIN,
  GUEST_LOGIN_SUCCESS,
  GUEST_LOGIN_FAIL
} from './types';
import {sceneKeys, navigateTo, navigateBackTo} from '../router';
import {strings} from '../i18n';

export const authPhoneSet = (phone) => {
  return { type: AUTH_PHONE_SET, payload: { phone } };
};

export const authCountryCodeSet = (country_code, call_code) => {
  return { type: AUTH_COUNTRY_CODE_SET, payload: { country_code, call_code } };
};

export const authVerificationSet = (verification_t) => {
  const verification = verification_t.replace(/\D/g, '').substring(0, 6);
  return { type: AUTH_VERIFICATION_SET, payload: { verification } };
};


export const authGuestLogin = () => {
  return (dispatch) => {
    dispatch({ type: GUEST_LOGIN_BEGIN });
    firebase.auth().signInAnonymously()
    .then(() => {
      console.log('authGuestLogin successful')
      dispatch({ type: GUEST_LOGIN_SUCCESS });
      // navigateTo(sceneKeys.addressCreate)
      try {
        AppEventsLogger.logEvent('GUEST_REGISTERED');
      } catch (e) {
        console.log('AppEventsLogger error', e)
      }
    })
    .catch(error => {
      console.log('authGuestLogin', error);
      dispatch({ type: GUEST_LOGIN_FAIL, payload: { error } })
    });
  };
};


export const authPhoneLogin = (phone, call_code) => {
  const formatted_phone = `+${call_code}${phone}`.replace(/\s/g, '');
  console.log('authPhoneLogin', phone, call_code, formatted_phone);
  // try { firebase.auth().signOut(); }
  return (dispatch) => {
    dispatch({ type: PHONE_ENTRY_BEGIN });
    firebase.auth().signInWithPhoneNumber(formatted_phone)
    .then(confirmation_function => {

      if (Platform.OS === "ios") {
        dispatch({ type: PHONE_ENTRY_SUCCESS, payload: { confirmation_function } });
        navigateTo(sceneKeys.verifyCode)
      } else {
        // IF ANDROID - wait half a second. if not logged in, then go to verify code
        // this is bc many phone skip confirmation, automatically detect
        setTimeout(() => {
          dispatch({ type: PHONE_ENTRY_SUCCESS, payload: { confirmation_function } });

          const { currentUser } = firebase.auth();
          if (!currentUser) {
            navigateTo(sceneKeys.verifyCode)
          }
        }, 500);
      }

      try {
        AppEventsLogger.logEvent('ACCOUNT_REGISTERED');
      } catch (e) {
        console.log('AppEventsLogger error', e)
      }
    }) // save confirm result to use with the manual verification code)
    .catch(error => {
      console.log(error);
      dispatch({ type: PHONE_ENTRY_FAIL, payload: { error } })
    });
    // Note: this catch may encompass errors beyond the login process itself
  };
};

export const authPhoneVerify = (code, confirmation_function) => {
  return (dispatch) => {

    // check if currently logged in (anonymously)
    const prevUser = firebase.auth().currentUser;
    dispatch({ type: VERIFICATION_BEGIN });

    confirmation_function.confirm(code)
      .then((user) => {
        console.log('authPhoneVerify successful')
        // continues in the Customer Actions onAuthStateChanged
      }) // User is logged in){
      .catch(error => {
        console.log('authPhoneVerify', error)
        Alert.alert(
          strings("Authentication.verificationCodeError"), 
          strings("Authentication.wrongVerificationCode")
        )
        dispatch({ type: VERIFICATION_FAIL, payload: { error } })
      });
  };
};

export const onCompleteAuth = (onComplete) => {
  return { type: AUTH_INIT, payload: { onComplete } };
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



// checks if addresses exist for the account
// if so, pop to Homepage
// otherwise create an address
// export const addressCreateProceedCheck = () => {
//   return (dispatch) => {
//     const user = firebase.auth().currentUser;
//
//     dispatch({ type: VERIFICATION_BEGIN });
//     const addressesRef = firebase.firestore().collection('customers').doc(user.uid)
//       .collection('addresses');
//     addressesRef.get().then((addressesT) => {
//       let addresses = addressesT.docs.map(addressDoc => {
//         const id = addressDoc.id;
//         const data = addressDoc.data();
//         return ({
//           ...data,
//           id
//         });
//       });
//       console.log('addressCreateProceedCheck addresses', addresses)
//       if (addresses.length > 0) {
//         navigateBackTo(sceneKeys.root);
//       } else {
//         console.log('GOING TO ADDRESS CREATE')
//       }
//       dispatch({ type: VERIFICATION_SUCCESS });
//     }).catch((error) => {
//       console.log('addressCreateProceedCheck error', error)
//       dispatch({ type: VERIFICATION_FAIL, payload: { error: 'Failed to check addresses' } });
//     })
//   }
// }
