/*
Coupon_Actions.js
*/

import firebase from 'react-native-firebase';
import { AppEventsLogger } from 'react-native-fbsdk';

import {
  COUPON_CODE_SUCCESS,
  COUPON_CODE_FAILURE,
  COUPON_CODE_LOADING,
  COUPON_CODE_RESET
} from './types';

export const applyCoupon = (code) => {
  return (dispatch) => {
    dispatch({ type: COUPON_CODE_LOADING });

    const couponJSON = { code };
    const { currentUser } = firebase.auth();
    if (currentUser) { couponJSON.customer_id = currentUser.uid; }
    console.log(couponJSON);

    const validateCoupon = firebase.functions().httpsCallable('validateCoupon');
    validateCoupon(couponJSON).then((result) => {
      // Read result of the Cloud Function.
      const { is_valid, coupon, error } = result.data;

      console.log(result.data);
      if (is_valid) {
        dispatch({ type: COUPON_CODE_SUCCESS, payload: { coupon } });

        firebase.analytics().logEvent("APPLIED_COUPON", { code });
        AppEventsLogger.logEvent('APPLIED_COUPON', { code });

      } else {
        dispatch({ type: COUPON_CODE_FAILURE, payload: { error } });
      }
    }).catch((error) => {
      console.log(error);
      dispatch({ type: COUPON_CODE_FAILURE, payload: { error: 'BADCONNECTION' } });
    });
  };
};

export const resetCoupon = () => {
  return { type: COUPON_CODE_RESET };
};
