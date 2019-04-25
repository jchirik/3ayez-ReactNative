/*
Auth_Actions.js
Includes all functions relating to a user's authentication status and the user's
account credentials (such as full name, addresses on file, preferences, and
sellers they have saved)
*/

import { Actions } from 'react-native-router-flux';
import { AsyncStorage, I18nManager, Platform } from 'react-native';
import firebase from 'react-native-firebase';
// import DeviceInfo from 'react-native-device-info';
// import RNRestart from 'react-native-restart';
import CodePush from 'react-native-code-push';
import RNLanguages from 'react-native-languages';

import {
  LOCALE_SET,
  DEVICEID_SET
} from './types';


const setLocaleSettings = (locale, dispatch) => {
  if ((locale === 'ar') && (!I18nManager.isRTL)) {
    I18nManager.forceRTL(true);
    // restart
    setTimeout(()=>{
        // if (Platform.OS === "ios") {
      	// 	RNRestart.Restart();
      	// }

        CodePush.restartApp();

      },200);
  } else if ((locale === 'en') && (I18nManager.isRTL)) {
    I18nManager.forceRTL(false);
    // restart
    setTimeout(()=>{
        // if (Platform.OS === "ios") {
        //   RNRestart.Restart();
        // }
        CodePush.restartApp();
    },200);
  }
  firebase.analytics().setUserProperty("language", locale);
  dispatch({ type: LOCALE_SET, payload: { locale } });
}

export const loadLocale = () => {
  return (dispatch) => {
    const device_language = RNLanguages.language;
    console.log('Device language', device_language);
    AsyncStorage.getItem('LOCALE', (err, locale) => {
      console.log('loadLocale', locale);
      if (locale === 'en' || locale === 'ar') {
        setLocaleSettings(locale, dispatch);
      } else if (device_language === 'en' || device_language === 'ar') {
        // if no locale available, use the system's (from i18n)
        setLocaleSettings(device_language, dispatch);
      } else {
        // otherwise arabic
        setLocaleSettings('ar', dispatch);
      }
    });
  };
};

export const setLocale = (locale) => {
  return (dispatch) => {
    AsyncStorage.setItem('LOCALE', locale, () => {
      console.log('set locale in async storage', locale)
    });
    setLocaleSettings(locale, dispatch);
  };
};


// // upon loading, attempt to load the device ID
// // if none exists, create and set in cache
// export const loadDeviceID = () => {
//   return (dispatch) => {
//     // GET the deviceID in persistent storage
//     AsyncStorage.getItem('DEVICEID', (err, device_id_t) => {
//       let device_id = device_id_t;
//       if (!device_id) {
//         try {
//           // try assigning device ID, otherwise use a random ID
//           device_id = DeviceInfo.getUniqueID();
//         } catch(error) {
//           // if Android 8, generate the deviceID as a random string (DONT use reactnativegetinfo)
//           device_id = firebase.firestore().collection('chats').doc().id;
//         }
//         // if doesnt exist, STORE the deviceID in persistent storage
//         AsyncStorage.setItem('DEVICEID', device_id, () => {
//           console.log('set device_id in async storage')
//         });
//       }
//
//       console.log('loadDeviceID', device_id); // should never be null
//       // save locally
//       dispatch({ type: DEVICEID_SET, payload: { device_id } });
//       // // save in firestore
//       // firebase.firestore().collection('chats').doc(device_id).set({ device_id }, { merge: true });
//     });
//   };
// };
