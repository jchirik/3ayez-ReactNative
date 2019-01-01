
export const fetchTimeslots = (sellerID) => {
  return (dispatch) => {
  dispatch({ type: TIMESLOTS_BEGIN });

  const fetchTimeslotsRemotely = firebase.functions().httpsCallable('fetchTimeslots');
  fetchTimeslotsRemotely({ seller_id: sellerID }).then((result) => {
     // delivery fee linked to TIMESLOT + distance ==> should be fetched from cloud FX


    // Read result of the Cloud Function.
    const { timeslots, error } = result.data;
    timeslots.sort((slotA, slotB) => { return slotA.start - slotB.start; });

    if (error) {
      console.log('ERROR', error);
      dispatch({ type: TIMESLOTS_FETCH_SET, payload: { timeslotDays: [] } });
      return;
    }

    const timeslotDays = [];

    // the 'section' in the presented sectionList
    // an object with all the shipments for a given day
    let day = { title: null, data: [] };

    timeslots.forEach(timeslot => {
      const sectionTitle = Moment(timeslot.start).locale('ar').calendar(null, {
        sameDay: '[اليوم]',
        nextDay: '[غدًا]',
        nextWeek: 'dddd',
        sameElse: 'L'
      });

      if (day.title === null) {
        day.title = sectionTitle;
      } else if (day.title !== sectionTitle) {
        timeslotDays.push(day);
        day = { title: sectionTitle, data: [] };
      }

      day.data.push(timeslot);
    });

    timeslotDays.push(day);
    console.log('Timeslot Days', timeslotDays);
    dispatch({
      type: TIMESLOTS_FETCH_SET,
      payload: { timeslotDays }
    });
  }).catch((error) => {
      console.log('ERROR', error);
      dispatch({ type: TIMESLOTS_FETCH_SET, payload: { timeslotDays: [] } });
      return;
    });
  };
};
