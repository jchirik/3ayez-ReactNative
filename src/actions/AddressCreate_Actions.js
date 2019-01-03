
import firebase from 'react-native-firebase';
import { Platform, PermissionsAndroid } from 'react-native';
import {
  ADDRESS_CREATE_RESET,
  ADDRESS_REGION_SET,
  ADDRESS_LOCATION_SET,
  ADDRESS_DETAILS_SET,

  CURRENT_LOCATION_BEGIN,
  CURRENT_LOCATION_SET,
  CURRENT_LOCATION_ERROR
} from './types';


export const resetAddressCreate = () => {
  return { type: ADDRESS_CREATE_RESET };
};

export const setAddressLocation = (point) => {
  return { type: ADDRESS_LOCATION_SET, payload: { point } };
};

export const setAddressRegion = (region) => {
  return { type: ADDRESS_REGION_SET, payload: { region } };
};

export const setAddressDetails = (details) => {
  return { type: ADDRESS_DETAILS_SET, payload: { ...details } };
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
      title: "3ayez Location Permission",
      message: "3ayez needs your current location to find nearby stores"
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
           if (position) {
            const { latitude, longitude } = position.coords;
            const point = { lat: latitude, lng: longitude };
            // update the current location locally and save
            dispatch({ type: CURRENT_LOCATION_SET, payload: { point }});
          } else {
            console.log('Error getting position');
            dispatch({ type: CURRENT_LOCATION_ERROR, payload: { error: 'NO_GPS_AVAILABLE' } });
          }
        },
        (error) => {
          console.log(error.message)
          dispatch({ type: CURRENT_LOCATION_ERROR, payload: { error: error.message } });
        },
        { enableHighAccuracy: true, timeout: 20000 }
      );
		});
  };
};
