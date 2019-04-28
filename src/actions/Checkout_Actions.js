

import { Actions } from 'react-native-router-flux';
import { AsyncStorage, Platform } from 'react-native';
import firebase from 'react-native-firebase';
import { playSound, SOUND_SWOOSH, SOUND_SUCCESS } from './sounds'

import { AppEventsLogger } from 'react-native-fbsdk';
import appsFlyer from 'react-native-appsflyer';

import {
  ORDER_SUBMIT_BEGIN,
  ORDER_SUBMIT_SUCCESS,
  ORDER_SUBMIT_FAIL,

  TIMESLOT_SET,
  PAYMENT_METHOD_SET,
  TIP_SET,
  ORDER_NOTES_SET,

  // after successfully sending order
  BASKET_ITEMS_CLEAR,
  COUPON_CODE_RESET,

  CHECKOUT_RESET
} from './types';
import {sceneKeys, navigateTo, navigateBackTo} from '../router';

export const submitOrder = (order_t, items_array, total) => {
  const {
    customer,
    seller
  } = order_t;

  const { currentUser } = firebase.auth();
  let device = 'MOBILE'
  if (Platform.OS === 'ios') {
    device = 'MOBILE_IOS'
  } else if (Platform.OS === 'android') {
    device = 'MOBILE_ANDROID'
  }

  const order = {
    ...order_t,
    customer: { id: currentUser.uid, name: customer.name, phone: customer.phone },
    seller: { id: seller.id, phone: seller.phone, display_name: seller.display_name, delivery_time: seller.delivery_time },
    device
  };

  console.log('submitOrder', order);

  return (dispatch) => {

    // dispatch({ type: ORDER_SUBMIT_BEGIN });
    //
    // playSound(SOUND_SUCCESS);
    // dispatch({ type: ORDER_SUBMIT_SUCCESS });
    // dispatch({ type: BASKET_ITEMS_CLEAR, payload: { seller_id: seller.id } });
    // dispatch({ type: COUPON_CODE_RESET });
    // Actions.popTo('homepage');

    dispatch({ type: ORDER_SUBMIT_BEGIN });
    const batch = firebase.firestore().batch();

    const orderRef = firebase.firestore().collection('orders').doc();
    batch.set(orderRef, order);

    const order_id = orderRef.id;
    items_array.forEach(item => {
      const itemRef = firebase.firestore().collection("orders").doc(order_id).collection("items").doc(item.upc);
      batch.set(itemRef, item);
    });

    batch.commit()
      .then((docRef) => {
        console.log('submitOrder success', docRef);

        playSound(SOUND_SUCCESS);
        dispatch({ type: ORDER_SUBMIT_SUCCESS });
        dispatch({ type: BASKET_ITEMS_CLEAR, payload: { seller_id: seller.id } });
        dispatch({ type: COUPON_CODE_RESET });
        navigateBackTo(sceneKeys.root);
        setTimeout(() => {
          navigateTo(sceneKeys.orderTracker, { order_id }); // you might have to refresh
        }, 1500);

        const purchaseTrackingParams = {
          total,
          af_revenue: total,
          af_currency: 'EGP',
          currency: 'EGP',
          seller_id: seller.id,
          coupon_code: (order.coupon ? order.coupon.code : null)
        };

        firebase.analytics().logEvent("ecommerce_purchase", purchaseTrackingParams);
        AppEventsLogger.logEvent('ecommerce_purchase');
        AppEventsLogger.logPurchase(total, 'EGP');

        appsFlyer.trackEvent('ecommerce_purchase', purchaseTrackingParams)
      })
      .catch((error) => {
        const { code, message, details } = error;
        console.log('ERROR', code, message, details);
        dispatch({ type: ORDER_SUBMIT_FAIL });
      });
  };
};


export const resetCheckout = () => {
  return { type: CHECKOUT_RESET };
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

export const setTip = (tip) => {
  return {
    type: TIP_SET,
    payload: { tip }
  };
};


export const setOrderNotes = (notes) => {
  return {
    type: ORDER_NOTES_SET,
    payload: { notes }
  };
};


export const setTimeslot = (timeslot) => {

  firebase.analytics().logEvent("SET_DELIVERY_TIME");
  AppEventsLogger.logEvent('SET_DELIVERY_TIME');

  return {
    type: TIMESLOT_SET,
    payload: { timeslot, delivery_fee: timeslot.delivery_fee }
  };


};
