
import firebase from 'react-native-firebase';
import {
  LOCATION_REVERSE_SEARCH_BEGIN,
  LOCATION_REVERSE_SEARCH_SET
} from './types';

export const reverseSearchAddress = (point) => {
  return (dispatch) => {
    // otherwise search
    dispatch({ type: LOCATION_REVERSE_SEARCH_BEGIN, payload: { query } });

    // triggers in both address create and reverse search reducers
    dispatch({ type: LOCATION_REVERSE_SEARCH_SET, payload: { query, street } });
  };
};
