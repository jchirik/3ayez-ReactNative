/*
Auth_Actions.js
Includes all functions relating to a user's authentication status and the user's
account credentials (such as full name, addresses on file, preferences, and
sellers they have saved)
*/

import { Actions } from 'react-native-router-flux';
import { AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';

import {
  LOCALE_SET,
  DEVICEID_SET
} from './types';

export const loadLocale = () => {
  return (dispatch) => {
    AsyncStorage.getItem('LOCALE', (err, locale) => {
      console.log('loadLocale', locale);
      if (locale === 'en' || locale === 'ar') {
        dispatch({ type: LOCALE_SET, payload: { locale } });
      }
    });
  };
};

export const setLocale = (locale) => {
  return (dispatch) => {
    AsyncStorage.setItem('LOCALE', locale, () => {
      console.log('set locale in async storage', locale)
    });
    dispatch({ type: LOCALE_SET, payload: { locale } });
  };
};


// upon loading, attempt to load the device ID
// if none exists, create and set in cache
export const loadDeviceID = () => {
  return (dispatch) => {
    // GET the deviceID in persistent storage
    AsyncStorage.getItem('DEVICEID', (err, device_id_t) => {
      let device_id = device_id_t;
      if (!device_id) {
        try {
          // try assigning device ID, otherwise use a random ID
          device_id = DeviceInfo.getUniqueID();
        } catch(error) {
          // if Android 8, generate the deviceID as a random string (DONT use reactnativegetinfo)
          device_id = firebase.firestore().collection('chats').doc().id;
        }
        // if doesnt exist, STORE the deviceID in persistent storage
        AsyncStorage.setItem('DEVICEID', device_id, () => {
          console.log('set device_id in async storage')
        });
      }

      console.log('loadDeviceID', device_id); // should never be null
      // save locally
      dispatch({ type: DEVICEID_SET, payload: { device_id } });
      // // save in firestore
      // firebase.firestore().collection('chats').doc(device_id).set({ device_id }, { merge: true });
    });
  };
};
