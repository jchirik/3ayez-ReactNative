/*
CustomerData_Actions.js
*/

import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';

import {
  REVIEW_ITEMS_DATA_BEGIN,
  REVIEW_ITEMS_DATA_SET,
  REVIEW_SUBSTITUTION_SET
} from './types';


export const submitOrderChanges = (order_id, review_items, substitutions) => {
  return (dispatch) => {
    console.log(order_id, review_items, substitutions);
  }
}


export const fetchReviewOrderItems = (order_id) => {
  return (dispatch) => {
    if (order_id) {

      dispatch({ type: REVIEW_ITEMS_DATA_BEGIN });
      // realtime listening of the order items
      const itemsListener = firebase.firestore().collection('orders').doc(order_id).collection('items')
        .get().then((documents) => {
          const items = documents.docs.map(item => {
            const id = item.id;
            const data = item.data();
            return ({ ...data, id });
          });
          const review_items = items.filter(item => item.in_review);
          dispatch({ type: REVIEW_ITEMS_DATA_SET, payload: { items, review_items } });
      });

    }
  };
};

export const setReviewItemSubstitution = (index, item) => {
  return (dispatch) => {
    dispatch({ type: REVIEW_SUBSTITUTION_SET, payload: { index, item } });
  };
};
