
import qs from 'qs';
import firebase from 'react-native-firebase';
import {
  ADDRESS_SEARCH_RESET,
  ADDRESS_SEARCH_BEGIN,
  ADDRESS_SEARCH_SET
} from './types';

const googlePlacesKey = 'AIzaSyDPWckRr8Yb1stsXBWeh1ME_UDjR9Y_GC0';

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
    const request = new XMLHttpRequest();
    dispatch({ type: ADDRESS_SEARCH_BEGIN, payload: { query, request } });

    // add fail methods here later
    request.timeout = 20000;
    request.ontimeout = () => console.warn('google places autocomplete: request timeout');
    request.onreadystatechange = () => {
      if (request.readyState !== 4) { return; }
      if (request.status === 200) {
        console.log(request.responseText)
        const responseJSON = JSON.parse(request.responseText);
        if (typeof responseJSON.predictions !== 'undefined') {
          const results = responseJSON.predictions;

          dispatch({ type: ADDRESS_SEARCH_SET, payload: { results } });
        }
        if (typeof responseJSON.error_message !== 'undefined') {
          console.warn('google places autocomplete: ' + responseJSON.error_message);
        }
      } else {
      console.warn(request.responseText);
      }
    };
    const queryObject = {
      input: query,
      key: googlePlacesKey,
      language: 'en',
      components: 'country:eg'
    };
    const jsonRequest = qs.stringify(queryObject);
    const requestURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${jsonRequest}`;
    request.open(
      'GET',
      requestURL
    );

    console.log(requestURL)

    request.send();
  };
};
