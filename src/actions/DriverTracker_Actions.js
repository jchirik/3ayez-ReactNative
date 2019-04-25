/*
CustomerData_Actions.js
*/

import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import { AppEventsLogger } from 'react-native-fbsdk';

import {
  DRIVER_TRACK_LISTENER_SET,
  DRIVER_TRACK_DATA_SET,
  DRIVER_TRACK_LISTENER_RESET
} from './types';

export const listenToDriver = (driver_id) => {
  return (dispatch) => {
    if (driver_id) {
      // realtime listening of the driver
      const driverListener = firebase.firestore().collection('drivers').doc(driver_id)
        .onSnapshot((document) => {
          if (document.exists) {
            const driver = { id: document.id, ...document.data() };
            dispatch({ type: DRIVER_TRACK_DATA_SET, payload: { driver } });
          }
      });
      dispatch({ type: DRIVER_TRACK_LISTENER_SET, payload: { driverListener } });

      firebase.analytics().logEvent("ENTERED_DRIVER_TRACKING");
      AppEventsLogger.logEvent('ENTERED_DRIVER_TRACKING');
    }
  };
};

export const endListeningToDriver = () => {
  return (dispatch) => {
    dispatch({ type: DRIVER_TRACK_LISTENER_RESET });
  };
};
