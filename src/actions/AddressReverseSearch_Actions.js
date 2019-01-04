
import firebase from 'react-native-firebase';
import { Platform, PermissionsAndroid } from 'react-native';
import {
  LOCATION_REVERSE_SEARCH_BEGIN,
  LOCATION_REVERSE_SEARCH_SET
} from './types';

import qs from 'qs';
const googlePlacesKey = 'AIzaSyDPWckRr8Yb1stsXBWeh1ME_UDjR9Y_GC0';
import { getTitleFromGooglePlace } from './Address_Helpers';

// ************
// ************
// MAKE all the on request.timeout errors for the user
// ************
// ************
// ************

export const reverseSearchAddress = (point) => {
  return (dispatch) => {
    // otherwise search
    const request = new XMLHttpRequest();
    dispatch({ type: LOCATION_REVERSE_SEARCH_BEGIN, payload: { request } });

    // add fail methods here later
    request.timeout = 20000;
    request.ontimeout = () => console.warn('google places autocomplete: request timeout');
    request.onreadystatechange = () => {
      if (request.readyState !== 4) { return; }
      if (request.status === 200) {
        const responseJSON = JSON.parse(request.responseText);
        if (typeof responseJSON.results !== 'undefined') {
          const results = responseJSON.results;
          console.log('reverseSearchAddress', results)

          let title = '';
          let type = '';

          if (results.length > 0) {
            const title_data = getTitleFromGooglePlace(results[0]);
            title = title_data.title;
            type = title_data.type;
          }

          console.log('reverseSearchAddress title', title);
          // triggers in both address create and reverse search reducers
          dispatch({ type: LOCATION_REVERSE_SEARCH_SET, payload: { title, type } });
        }
        if (typeof responseJSON.error_message !== 'undefined') {
          console.warn('google places autocomplete: ' + responseJSON.error_message);
        }
      } else {
      console.warn(request.responseText);
      }
    };
    const queryObject = {
      latlng: `${point.lat},${point.lng}`,
      key: googlePlacesKey,
      language: 'en'
    };
    const jsonRequest = qs.stringify(queryObject);
    const requestURL = `https://maps.googleapis.com/maps/api/geocode/json?${jsonRequest}`;
    request.open(
      'GET',
      requestURL
    );
    console.log(requestURL);
    request.send();
  }
}
