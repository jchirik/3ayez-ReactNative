
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import {
  AsyncStorage,
  Platform,
  PermissionsAndroid
} from 'react-native';
import {
  REGIONS_FETCH_BEGIN,
  REGIONS_FETCH_SET,

  AREA_RESULTS_FETCH_BEGIN,
  AREA_RESULTS_FETCH_SET,

  CURRENT_AREA_BEGIN,
  CURRENT_AREA_SET,
  CURRENT_AREA_ERROR
} from './types';

import {sceneKeys, navigateTo, navigateBackTo, navigateBack} from '../router';

import {
  strings
} from '../i18n.js';


export const fetchAllRegions = (beta_tester) => {
  return (dispatch) => {
    dispatch({ type: REGIONS_FETCH_BEGIN });
    console.log('fetchAllRegions BEGIN')

    const regionsRef = firebase.firestore().collection('regions');
    regionsRef.get().then((regionsT) => {
      let regions = [];

      regionsT.docs.forEach(regionDoc => {
        const id = regionDoc.id;
        const data = regionDoc.data();
        if (id === 'TEST') {
          if (beta_tester) {
            regions.push({ ...data, id });
          }
        } else {
          regions.push({ ...data, id });
        }
      });
      regions = regions.sort((a, b) => { return a.index - b.index })
      console.log('regions', regions);
      dispatch({ type: REGIONS_FETCH_SET, payload: { regions } });
    });
  };
};

// swap this with algolia
export const searchAreas = (query, region) => {
  return (dispatch) => {
    dispatch({ type: AREA_RESULTS_FETCH_BEGIN });
    console.log('searchAreas BEGIN')

    const areasRef = firebase.firestore().collection('geofences')
      .where('region', '==', region);

    areasRef.get().then((area_resultsT) => {
      let area_results = [];
      area_resultsT.docs.forEach(areaResultDoc => {
        const id = areaResultDoc.id;
        const data = areaResultDoc.data();
        area_results.push({ ...data, id });
      });
      // regions = area_results.sort((a, b) => { return a.index - b.index })
      console.log('area_results', area_results);
      dispatch({ type: AREA_RESULTS_FETCH_SET, payload: { area_results } });
    });
  };
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


export const calculateAreaForLocation = (region) => {
  return (dispatch) => {
  dispatch({ type: CURRENT_AREA_BEGIN });

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

          // fetch neighborhood for current location, save ID in the object
          const calculateAreaForCoordinate = firebase.functions().httpsCallable('calculateAreaForCoordinate');
          calculateAreaForCoordinate({ ...location, region }).then((result) => {
            // Read result of the Cloud Function.
            console.log('fetched area', result.data);

            if (result.data) {
              dispatch({ type: CURRENT_AREA_SET, payload: { area: result.data }});
            } else {
              dispatch({ type: CURRENT_AREA_ERROR, payload: { error: 'NO_VALID_AREA' }});
            }
          }).catch((error) => {
            console.log('failed to fetch location', error);
            dispatch({ type: CURRENT_AREA_ERROR, payload: { error: 'FAILED_CALCULATE_AREA' }});
          });

        } else {
          console.log('Error getting position');
          dispatch({ type: CURRENT_AREA_ERROR, payload: { error: 'NO_GPS_AVAILABLE' }});
        }
      },
      (error) => {
        console.log(error.message)
        dispatch({ type: CURRENT_AREA_ERROR, payload: { error: 'NO_GPS_AVAILABLE' }});
      },
      { enableHighAccuracy: true, timeout: 3000 }
    );
  }).catch(() => {
    dispatch({ type: CURRENT_AREA_ERROR, payload: { error: 'NO_GPS_PERMISSION' }});
  });
}}
