
import qs from 'qs';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import {
  ADDRESS_SEARCH_RESET,
  ADDRESS_SEARCH_BEGIN,
  ADDRESS_SEARCH_SET,

  ADDRESS_LOCATION_BEGIN,
  ADDRESS_LOCATION_SET,
  ADDRESS_LOCATION_ERROR,

  LOCATION_REVERSE_SEARCH_SET
} from './types';

const googlePlacesKey = 'AIzaSyDPWckRr8Yb1stsXBWeh1ME_UDjR9Y_GC0';
import { getTitleFromGooglePlace } from './Address_Helpers';

export const searchAddresses = (query, locale) => {
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
      language: locale,
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

// LOADING NEEDED !!!!
// given a selected autocomplete result, fetches the coordinate
// then set the Address Location as this coordinate to begin
export const selectGooglePlaceResult = (google_place) => {
  return (dispatch) => {
      const { place_id } = google_place;

      // fetch details
      const request = new XMLHttpRequest();
      dispatch({ type: ADDRESS_LOCATION_BEGIN });

      request.timeout = 20000;
      request.ontimeout = () => console.warn('google places autocomplete: request timeout');
      request.onreadystatechange = () => {
      if (request.readyState !== 4) return;

      if (request.status === 200) {
        const responseJSON = JSON.parse(request.responseText);
        if (responseJSON.status === 'OK') {
          const { result } = responseJSON;
          const { lat, lng } = result.geometry.location;
          const location = { lat, lng };

          dispatch({ type: ADDRESS_LOCATION_SET, payload: { location } })
          console.log(location);

          // provide the location details, without reverse search yet
          const { title, type } = getTitleFromGooglePlace(result);
          dispatch({ type: LOCATION_REVERSE_SEARCH_SET, payload: { title, type } });

          Actions.refineLocation();
        } else {
          console.warn('google places autocomplete: ' + responseJSON.status);
          dispatch({ type: ADDRESS_LOCATION_ERROR, payload: { error: responseJSON.status } });
        }
      } else {
        console.warn(request.responseText);
        dispatch({ type: ADDRESS_LOCATION_ERROR, payload: { error: request.responseText } });
      }
    };

    const jsonRequest = qs.stringify({
      key: googlePlacesKey,
      placeid: place_id
    });
    request.open(
      'GET',
      `https://maps.googleapis.com/maps/api/place/details/json?${jsonRequest}`
    );
    request.send();
  };
};
