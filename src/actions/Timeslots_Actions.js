import firebase from 'react-native-firebase';

import {
  TIMESLOTS_FETCH_BEGIN,
  TIMESLOTS_FETCH_SET,
  TIMESLOTS_FETCH_ERROR
} from './types';

import {
  formatDay
} from '../i18n.js';

export const fetchTimeslots = (seller_id) => {
  return (dispatch) => {
  dispatch({ type: TIMESLOTS_FETCH_BEGIN });

  const fetchTimeslotsRemotely = firebase.functions().httpsCallable('fetchTimeslots');
  fetchTimeslotsRemotely({ seller_id }).then((result) => {
     // delivery fee linked to TIMESLOT + distance ==> should be fetched from cloud FX

    // Read result of the Cloud Function.
    const { timeslots, error } = result.data;
    timeslots.sort((slotA, slotB) => { return slotA.start - slotB.start; });

    if (error) {
      console.log('fetchTimeslots error', error);
      dispatch({ type: TIMESLOTS_FETCH_ERROR });
      return;
    }

    const timeslotDays = [];

    // the 'section' in the presented sectionList
    // an object with all the shipments for a given day
    let day = { title: null, data: [] };

    timeslots.forEach(timeslot => {
      const sectionTitle = formatDay(timeslot.start);
      if (day.title === null) {
        day.title = sectionTitle;
      } else if (day.title !== sectionTitle) {
        timeslotDays.push(day);
        day = { title: sectionTitle, data: [] };
      }

      day.data.push(timeslot);
    });

    timeslotDays.push(day);
    console.log('fetchTimeslots timeslots', timeslotDays);
    dispatch({
      type: TIMESLOTS_FETCH_SET,
      payload: { timeslots: timeslotDays }
    });
  }).catch((error) => {
      console.log('fetchTimeslots error', error);
      dispatch({ type: TIMESLOTS_FETCH_ERROR });
      return;
    });
  };
};
