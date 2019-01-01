//
// import firebase from 'react-native-firebase';
// import {
//   UPDATE_WORKING_ADDRESS,
//   RESET_WORKING_ADDRESS,
//
//   FETCH_MAP_POINT_BEGIN,
//   FETCH_MAP_POINT_END
// } from './types';
// 
//
//
// export const updateWorkingAddress = (key, value) => {
//   return (dispatch) => {
//     dispatch({ type: UPDATE_WORKING_ADDRESS, payload: { key, value } });
//   };
// };
//
// export const resetWorkingAddress = () => {
//   return (dispatch) => {
//     dispatch({ type: RESET_WORKING_ADDRESS });
//   };
// };
//
//
//
// // given location text from the user, attempt to find the point on google maps
// // if none, fall back to current location (if inside the region)
// // if unavail, fallack to the region center
// export const getMapPointForLocation = (location, area_id, language) => {
//
//   return (dispatch) => {
//
//     // calculate the average point
//     dispatch({ type: FETCH_MAP_POINT_BEGIN });
//     console.log('getMapPointForLocation', location, area_id);
//
//     const params = {
//       building: location.building,
//       street: location.street,
//       area_id,
//       language
//     }
//
//     const getCoordinateForTextQuery = firebase.functions().httpsCallable('getCoordinateForTextQuery');
//     getCoordinateForTextQuery(params).then((result) => {
//       // Read result of the Cloud Function.
//       console.log('getCoordinateForTextQuery', result);
//       dispatch({ type: FETCH_MAP_POINT_END, payload: { point: result.data } });
//     })
//
//     // what happens if it fails??
//
//   };
// };
