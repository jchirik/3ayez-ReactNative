/*
Auth_Actions.js
Includes all functions relating to a user's authentication status and the user's
account credentials (such as full name, addresses on file, preferences, and
sellers they have saved)
*/

import { Actions } from 'react-native-router-flux';
import { AsyncStorage } from 'react-native';
import {
  LOCALE_SET
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
