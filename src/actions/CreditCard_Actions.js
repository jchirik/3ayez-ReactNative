/*
CardPayment_Actions.js
*/

import { Actions } from 'react-native-router-flux';
import stripe from 'tipsi-stripe';
import firebase from 'react-native-firebase';

stripe.setOptions({
  publishableKey: 'pk_test_xJDG7ffhtbS0L6LYFsnGZ9cd'
});

import {
  PAYMENT_METHOD_SET,
  CREDITCARD_CREATE_BEGIN,
  CREDITCARD_CREATE_SUCCESS,
  CREDITCARD_CREATE_FAIL,
  CREDITCARD_CREATE_RESET
} from './types';
import { navigateBack } from '../router';


export const deleteCreditCard = (card_id) => {
  return (dispatch) => {
    console.log('deleteCreditCard', card_id);
    const { currentUser } = firebase.auth();
    const cardRef = firebase.firestore().collection('customers').doc(currentUser.uid)
      .collection('cards').doc(card_id);
    cardRef.delete().then(() => {
      console.log('deleteCreditCard successful', card_id, currentUser.uid);
    })
  }
}

 // update the homescreen list
export const createStripeCard = (card_data) => {
  return (dispatch) => {

    const { currentUser } = firebase.auth();
    const {
      name,
      number,
      expiry,
      cvc,
      type
    } = card_data;

    dispatch({ type: CREDITCARD_CREATE_BEGIN });

    const expirySplit = expiry.split('/');
    const params = {
      // mandatory
      number,
      expMonth: parseInt(expirySplit[0], 10),
      expYear: parseInt(expirySplit[1], 10),
      cvc,
      // optional
      name
    };
    stripe.createTokenWithCard(params).then(success => {
      console.log('createStripeCard success', success)
      const cardData = success.card;
      const card = {
        type: 'CREDIT',
        id: cardData.cardId,
        token: success.tokenId,
        brand: cardData.brand,
        country: cardData.country,
        exp_month: cardData.expMonth,
        exp_year: cardData.expYear,
        last4: cardData.last4,
        customer_id: currentUser.uid
      };

      const addStripeCreditCard = firebase.functions().httpsCallable('addStripeCreditCard');
      addStripeCreditCard(card).then((result) => {
        console.log('addStripeCreditCard returned', result)
        if (result.data && result.data.success) {
          dispatch({
            type: PAYMENT_METHOD_SET,
            payload: { payment_method: card }
          });
          dispatch({ type: CREDITCARD_CREATE_SUCCESS });
          navigateBack()
        } else {
          dispatch({ type: CREDITCARD_CREATE_FAIL, payload: { error: 'Invalid from server' } });
          console.log('credit card error');
        }
      }).catch((error) => {
        dispatch({ type: CREDITCARD_CREATE_FAIL, payload: { error } });
        console.log('credit card error');
      });

    })
    .catch((error) => {
      dispatch({ type: CREDITCARD_CREATE_FAIL, payload: { error } });
      console.log('CREDIT CARD', error);
    });
  };
};


export const createStripeCardReset = () => {
  return (dispatch) => {
    dispatch({ type: CREDITCARD_CREATE_RESET });
  }
}
