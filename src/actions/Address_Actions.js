
import firebase from 'react-native-firebase';
import { AsyncStorage } from 'react-native';
import {
  ADDRESS_SET
} from './types';

export const setAddress = (address) => {
  return (dispatch) => {
    AsyncStorage.setItem('ADDRESS', JSON.stringify(address), () => {
      console.log('set address in async storage', address)
    });
    dispatch({ type: ADDRESS_SET, payload: { address } });
  };
};

export const loadAddress = () => {
  return (dispatch) => {
    AsyncStorage.getItem('ADDRESS', (err, address_t) => {
      if (address_t) {
        const address = JSON.parse(address_t);
        dispatch({ type: ADDRESS_SET, payload: { address } });
      }
    });
  };
};
