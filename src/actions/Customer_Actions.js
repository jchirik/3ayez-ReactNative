
import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import { setPushToken } from './PushToken_Helpers';

import {
  CUSTOMER_DATA_SET,
  CUSTOMER_DATA_LISTENER_SET,
  CUSTOMER_DATA_RESET
} from './types';

export const listenCustomerAuthStatus = () => {
  return (dispatch) => {
    // after rendering, listen to auth status
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('onAuthStateChanged', user);
        firebase.crashlytics().setUserIdentifier(user.uid);
        listenCustomerData(dispatch);
        setPushToken(firebase.firestore().collection('customers').doc(user.uid));
      } else {
        console.log('onAuthStateChanged logged out');
        dispatch({ type: CUSTOMER_DATA_RESET });
      }
    });
  };
};

// detected a login & begin fetching customer account information
const listenCustomerData = (dispatch) => {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    // realtime listening
    const listener = firebase.firestore().collection('customers').doc(currentUser.uid)
        .onSnapshot((document) => {
          if (!document.exists) {
            // if the user's data document doesnt exist yet, create it!
            firebase.firestore()
              .collection('customers')
              .doc(currentUser.uid)
              .set({ phone: currentUser.phoneNumber }, { merge: true })
              .then(() => {
                console.log('created user in database');
              });
            dispatch({ type: CUSTOMER_DATA_SET, payload: { phone: currentUser.phoneNumber } });
          } else {
            const payload = document.data();
            console.log('listenCustomerData', payload)
            dispatch({ type: CUSTOMER_DATA_SET, payload });
          }
        });
    dispatch({ type: CUSTOMER_DATA_LISTENER_SET, payload: { listener } });
  }
};
