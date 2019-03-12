
import firebase from 'react-native-firebase';
import { Platform, PermissionsAndroid } from 'react-native';
import {
  ADDRESS_CREATE_RESET,
  ADDRESS_LOCATION_SET,
  ADDRESS_DETAIL_SET,

  CURRENT_LOCATION_BEGIN,
  CURRENT_LOCATION_ERROR,

  ADDRESS_AREA_BEGIN,
  ADDRESS_AREA_SET,
  ADDRESS_AREA_ERROR
} from './types';

import {
  strings
} from '../i18n.js';

export const resetAddressCreate = () => {
  return { type: ADDRESS_CREATE_RESET };
};

export const setAddressDetail = (payload) => {
  return { type: ADDRESS_DETAIL_SET, payload };
};

export const setAddressLocation = (location) => {
  return { type: ADDRESS_LOCATION_SET, payload: { location } };
};

// Show permission Dialog on Android
// Only needed on Andorid
const requestLocationPermission = async () => {
	if (Platform.OS === "ios") {
		return;
	}
	return await PermissionsAndroid.request(
		PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
		{
      title: strings('SystemPermissions.currentLocationTitle'),
      message: strings('SystemPermissions.currentLocationMessage')
		}
	);
};

export const setCurrentLocation = () => {
  return (dispatch) => {
    dispatch({ type: CURRENT_LOCATION_BEGIN });

    requestLocationPermission().then(result => {

      console.log('requested permission', result)

			if (Platform.OS === "android" && result !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('no gps permission')
        dispatch({ type: CURRENT_LOCATION_ERROR, payload: { error: 'NO_GPS_PERMISSION' }});
        return;
			}

      // get current coordinate
      navigator.geolocation.getCurrentPosition(
         (position) => {
           console.log('Position:', position)
           if (position && position.coords && position.coords.latitude && position.coords.longitude) {
            const { latitude, longitude } = position.coords;
            const location = { lat: latitude, lng: longitude };
            // update the current location locally and save
            dispatch({ type: ADDRESS_LOCATION_SET, payload: { location } });
          } else {
            console.log('Error getting position');
            dispatch({ type: CURRENT_LOCATION_ERROR, payload: { error: 'NO_GPS_AVAILABLE' } });
          }
        },
        (error) => {
          console.log(error.message)
          dispatch({ type: CURRENT_LOCATION_ERROR, payload: { error: error.message } });
        },
        { enableHighAccuracy: true, timeout: 3000 }
      );
		});
  };
};


export const calculateAreaForLocation = (location) => {
  return (dispatch) => {
  dispatch({ type: ADDRESS_AREA_BEGIN });

  // fetch neighborhood for current location, save ID in the object
  const calculateAreaForCoordinate = firebase.functions().httpsCallable('calculateAreaForCoordinate');
  calculateAreaForCoordinate(location).then((result) => {
    // Read result of the Cloud Function.
    console.log('fetched area', result.data);

    if (result.data) {
      dispatch({ type: ADDRESS_AREA_SET, payload: { area: result.data }});
    } else {
      dispatch({ type: ADDRESS_AREA_ERROR, payload: { error: 'NO_VALID_AREA' }});
    }
  }).catch((error) => {
    console.log('failed to fetch location', error);
    dispatch({ type: ADDRESS_AREA_ERROR, payload: { error: 'FAILED_CALCULATE_AREA' }});
  });

}}
