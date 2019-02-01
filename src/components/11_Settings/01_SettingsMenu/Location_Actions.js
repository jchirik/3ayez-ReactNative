/* Location */

import firebase from 'react-native-firebase';
import {
  Platform,
  PermissionsAndroid
} from 'react-native';

import {
  AREA_SET,

  CURRENT_LOCATION_BEGIN,
  CURRENT_LOCATION_SET,
  CURRENT_LOCATION_AREA_SET,
  CURRENT_LOCATION_ERROR_SET,

  AREAS_FETCH_BEGIN,
  AREAS_FETCH_SET,

  AREA_SEARCH_SET
} from './types';


// AUTO_AREA_BEGIN,
// AUTO_AREA_SET,
// SET_MAP_LOCATION,
// SET_TEMP_AREA,
// SET_AREA,
// SET_CURRENT_LOCATION,
//
// SET_LOCATION_QUERY,
// SET_LOCATION_QUERY_RESULTS,
// ABORT_LOCATION_REQUESTS,
// BEGIN_LOCATION_REQUEST,
//
// MOVE_LOCATION_RESET,
//
// GEOFENCE_FETCH_BEGIN,
// GEOFENCE_FETCH_SET

// import GeoFencing from 'react-native-geo-fencing';
// const googlePlacesKey = 'AIzaSyBNz3kSfxfjLRn2HgQDcW4zDt9ZykstAYw';

// const sanitizeNeighborhood(neighborhood) {
//
// }

// the final area selected from search
export const setArea = (area) => {
  if (area) {
    return {
      type: AREA_SET,
      payload: { area }
    };
  }
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


export const detectCurrentLocation = () => {
  return (dispatch) => {
    dispatch({ type: CURRENT_LOCATION_BEGIN });

    requestLocationPermission().then(result => {

      console.log('requested permission', result)

			if (Platform.OS === "android" && result !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('no gps permission')
        dispatch({ type: CURRENT_LOCATION_ERROR_SET, payload: { currentLocationError: 'NO_GPS_PERMISSION' }});
        return;
			}

      // get current coordinate
      navigator.geolocation.getCurrentPosition(
         (position) => {
           console.log('Position:', position)
           if (position) {
            const { latitude, longitude } = position.coords;
            const currentLocation = { lat: latitude, lng: longitude };
            // update the current location locally and save
            dispatch({ type: CURRENT_LOCATION_SET, payload: { currentLocation }});

            console.log('fetched current location', currentLocation)

            // fetch neighborhood for current location, save ID in the object
            const calculateAreaForCoordinate = firebase.functions().httpsCallable('calculateAreaForCoordinate');
            calculateAreaForCoordinate(currentLocation).then((result) => {
              // Read result of the Cloud Function.
              console.log('fetched location', result.data);

              if (result.data) {
                dispatch({ type: CURRENT_LOCATION_AREA_SET, payload: { currentArea: result.data }});
              } else {
                dispatch({ type: CURRENT_LOCATION_ERROR_SET, payload: { currentLocationError: 'NO_VALID_AREA' }});
              }
            }).catch((error) => {
              console.log('failed to fetch location', error);
              dispatch({ type: CURRENT_LOCATION_ERROR_SET, payload: { currentLocationError: 'FAILED_CALCULATE_AREA' }});
            });
          } else {
            console.log('Error getting position')
            dispatch({ type: CURRENT_LOCATION_ERROR_SET, payload: { currentLocationError: 'NO_GPS_AVAILABLE' }});
          }
        },
        (error) => console.log(error.message),
        { enableHighAccuracy: true, timeout: 20000 }
      );

		});
  };
};



// fetch all neighborhoods from firestore
export const fetchAreas = () => {
  return (dispatch) => {
    dispatch({ type: AREAS_FETCH_BEGIN });

    // get from firestore
    firebase.firestore().collection('geofences').get()
		.then((geofencesData) => {

        const allAreas = [];

        geofencesData.docs.forEach(geofence => {
          const id = geofence.id;
          const data = geofence.data();
          let { display_name, region } = data;

          // ignore items with bad display name / region
          if (!display_name || !region) { return; }
          if (!display_name.ar || !display_name.en) { return; }

          allAreas.push({ id, display_name, region });
        });

      console.log('area fetch results', allAreas);

      dispatch({ type: AREAS_FETCH_SET, payload: { allAreas } });
    })
    .catch(e => console.log('error', e));
  };
};


// return all neighborhoods for the given query
// return their names + id only
export const searchAreas = (areaSearchQuery, allAreas) => {
  return (dispatch) => {
    // filter by the query
    const areaSearchResults = allAreas.filter(area => (
      area.display_name.ar.includes(areaSearchQuery) ||
      area.display_name.en.toUpperCase().includes(areaSearchQuery.toUpperCase())
    ))
    dispatch({ type: AREA_SEARCH_SET, payload: { areaSearchQuery, areaSearchResults } });
  };
};
