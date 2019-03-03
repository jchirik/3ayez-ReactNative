
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import {
  FEEDBACK_RESET,
  FEEDBACK_STORE_RATING_SET,
  FEEDBACK_AYEZ_RATING_SET,
  FEEDBACK_SELLER_SET,

  FEEDBACK_SUBMIT_BEGIN,
  FEEDBACK_SUBMIT_SUCCESS,
  FEEDBACK_SUBMIT_ERROR
} from './types';
import { navigateBack } from '../router';


export const setStoreRating = (store_rating) => {
  return { type: FEEDBACK_STORE_RATING_SET, payload: { store_rating } };
};

export const setAyezRating = (ayez_rating) => {
  return { type: FEEDBACK_AYEZ_RATING_SET, payload: { ayez_rating } };
};

export const resetCustomerFeedback = () => {
  return { type: FEEDBACK_RESET };
};

export const fetchFeedbackSeller = (seller_id) => {
  return (dispatch) => {
    const sellerRef = firebase.firestore().collection('sellers').doc(seller_id)
    sellerRef.get().then((document) => {
      const seller = { id: document.id, ...document.data() };
      console.log('fetchFeedbackSeller', seller)
      dispatch({ type: FEEDBACK_SELLER_SET, payload: { seller } });
    });
  }
};

export const submitCustomerFeedback = (order_id, customer_feedback) => {
  return (dispatch) => {
    dispatch({ type: FEEDBACK_SUBMIT_BEGIN });
    firebase.firestore().collection('orders').doc(order_id).update({ customer_feedback })
    .then(() => {
      dispatch({ type: FEEDBACK_SUBMIT_SUCCESS });
      navigateBack()
    }).catch((error) => {
      console.log(error)
      dispatch({ type: FEEDBACK_SUBMIT_ERROR, payload: { error } });
    })
  };
};
