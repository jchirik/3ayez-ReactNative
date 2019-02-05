/*
Auth_Actions.js
Includes all functions relating to a user's authentication status and the user's
account credentials (such as full name, addresses on file, preferences, and
sellers they have saved)
*/

import { Actions } from 'react-native-router-flux';
import { AsyncStorage, I18nManager, Platform } from 'react-native';
import firebase from 'react-native-firebase';

import {
  SUPPORT_MANUAL_SET
} from './types';

export const loadSupportManual = () => {
  return (dispatch) => {
    const supportManualRef = firebase.firestore().collection('app').doc('support_manual')
    supportManualRef.get().then((document) => {
      if (document.exists) {
        const { manual } = document.data();
        if (manual) {
          dispatch({ type: SUPPORT_MANUAL_SET, payload: { manual } });
          return;
        }
      }
      dispatch({ type: SUPPORT_MANUAL_SET, payload: { manual: [] } });
    }).catch((err) => {
      dispatch({ type: SUPPORT_MANUAL_SET, payload: { manual: [] } });
    })
  };
};
