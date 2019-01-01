

import { Actions } from 'react-native-router-flux';
import { AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';

// import { playSound, SOUND_SWOOSH, SOUND_SUCCESS } from './sounds'

import {
  ORDER_SUBMIT_BEGIN,
  ORDER_SUBMIT_SUCCESS,
  ORDER_SUBMIT_FAIL,

  TIMESLOT_SET,
  PAYMENT_METHOD_SET,

  // after successfully sending order
  BASKET_ITEMS_CLEAR,
  COUPON_CODE_RESET,
} from './types';

export const submitOrder = (order) => {
  return (dispatch) => {

    // console.log('submitting order', order);
    dispatch({ type: ORDER_SUBMIT_BEGIN });

    firebase.firestore().collection('orders').add(order)
      .then((docRef) => {
        console.log('SUCCESSFUL UPLOAD!! Clearing', docRef);

        // playSound(SOUND_SUCCESS);
        dispatch({ type: ORDER_SUBMIT_SUCCESS });
        dispatch({ type: BASKET_ITEMS_CLEAR });
        dispatch({ type: COUPON_CODE_RESET });

        // succesfully ADDED THE DOCUMENT
        Actions.popTo('storeSelect');
        // setTimeout(() => {
        //   Actions.tracker({ orderID: docRef.id }); // you might have to refresh
        // }, 1500);

      })
      .catch((error) => {
        const { code, message, details } = error;
        console.log('ERROR', code, message, details);
        dispatch({ type: ORDER_SUBMIT_FAIL });
      });
  };
};


export const cancelOrder = (order_id) => {
  return (dispatch) => {
    const updateJSON = { status: 300 };
    firebase.firestore().collection('orders').doc(order_id).update(updateJSON);
  };
};




export const setPaymentMethod = (payment_method) => {
  return {
    type: PAYMENT_METHOD_SET,
    payload: { payment_method }
  };
};

export const didSelectTimeslot = (timeslot) => {
  return {
    type: TIMESLOT_SET,
    payload: { timeslot }
  };
};
