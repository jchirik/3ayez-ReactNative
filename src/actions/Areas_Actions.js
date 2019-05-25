
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import { AsyncStorage } from 'react-native';
import { AppEventsLogger } from 'react-native-fbsdk';
import {
  SELECTED_AREA_SET,
  SAVED_AREAS_SET,
  SAVED_AREAS_BEGIN,
  SAVED_AREAS_FAIL
} from './types';
import {sceneKeys, navigateTo, navigateBackTo, navigateBack} from '../router';

import {
  fetchNearbySellers
} from './SellerSearch_Actions'


// fetchSavedAreas
// selectArea

// selected_area,
// saved_areas,
// is_loading_saved_areas,
// is_loading_selected_area


export const fetchSavedAreas = () => {
  return (dispatch) => {
    const { currentUser } = firebase.auth();
    if (!currentUser) { return; }
    dispatch({ type: SAVED_AREAS_BEGIN });
    console.log('fetchCustomerSavedAreas BEGIN')

    const fetchCustomerSavedAreas = firebase.functions().httpsCallable('fetchCustomerSavedAreas');
    fetchCustomerSavedAreas({ customer_id: currentUser.uid }).then((result) => {
      console.log('fetchCustomerSavedAreas returned', result)
      if (result.data) {
        const saved_areas = result.data.saved_areas;

        if (!saved_areas.length) {
          navigateTo(sceneKeys.areaCreate);
        }
        dispatch({ type: SAVED_AREAS_SET, payload: { saved_areas } });
      } else {
        dispatch({ type: SAVED_AREAS_FAIL, payload: { error: 'Bad result' } });
      }
    }).catch((error) => {
      console.log('fetchCustomerSavedAreas error', error);
      dispatch({ type: SAVED_AREAS_FAIL, payload: { error } });
    });
  };
};


export const selectArea = (selected_area) => {
  return (dispatch) => {
    const { currentUser } = firebase.auth();
    if (!currentUser) { return; }
    dispatch({ type: SELECTED_AREA_SET, payload: { selected_area } });

    console.log('selectArea', selected_area.id, selected_area)

    // fetch the store from seller search
    fetchNearbySellers(selected_area, dispatch);

    navigateTo(sceneKeys.storeSelect)

    const customerRef = firebase.firestore().collection('customers').doc(currentUser.uid)
    const updateObject = {};
    updateObject[`areas.${selected_area.id}`] = Date.now()
    customerRef.update(updateObject).then(() => console.log('Updated areas'));

    firebase.analytics().logEvent("SELECTED_AREA");
    firebase.analytics().setUserProperty("last_area", selected_area.id);
    AppEventsLogger.logEvent('SELECTED_AREA');
  };
};
