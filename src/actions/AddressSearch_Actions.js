
import firebase from 'react-native-firebase';
import {
  ADDRESS_SEARCH_RESET,
  ADDRESS_SEARCH_BEGIN,
  ADDRESS_SEARCH_SET
} from './types';

export const resetAddressSearch = () => {
  return { type: ADDRESS_SEARCH_RESET };
};

export const searchAddresses = (query) => {
  return (dispatch) => {
    // if an empty query, reset the search screen
    if (!query) {
      dispatch({ type: ADDRESS_SEARCH_RESET });
      return;
    }

    // otherwise search
    dispatch({ type: ADDRESS_SEARCH_BEGIN, payload: { query } });
    dispatch({ type: ADDRESS_SEARCH_SET, payload: { query, results } });
  };
};
