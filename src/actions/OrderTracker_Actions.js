/*
CustomerData_Actions.js
*/

import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';

import {
  ORDER_TRACK_LISTENER_SET,
  ORDER_TRACK_DATA_SET,
  ORDER_ITEMS_TRACK_DATA_SET,
  ORDER_TRACK_LISTENER_RESET
} from './types';


export const listenToOrder = (order_id) => {
  return (dispatch) => {
    if (order_id) {

      // realtime listening of the order
      const orderListener = firebase.firestore().collection('orders').doc(order_id)
        .onSnapshot((document) => {
          if (document.exists) {
            const order = { id: document.id, ...document.data() };
            console.log('Order', order);
            dispatch({ type: ORDER_TRACK_DATA_SET, payload: { order } });
          }
      });

      // realtime listening of the order items
      const itemsListener = firebase.firestore().collection('orders').doc(order_id).collection('items')
        .onSnapshot((documents) => {
          let items = documents.docs.map(item => {
            const id = item.id;
            const data = item.data();
            return ({ ...data, id });
          });
          dispatch({ type: ORDER_ITEMS_TRACK_DATA_SET, payload: { items } });
      });

      dispatch({ type: ORDER_TRACK_LISTENER_SET, payload: { orderListener, itemsListener } });
    }
  };
};

export const endListeningToOrder = (order_id) => {
  return (dispatch) => {
    dispatch({ type: ORDER_TRACK_LISTENER_RESET, payload: { order_id } });
  };
};


export const markOrderCustomerReceived = (orderID) => {
  return () => {
    firebase.firestore()
      .collection('orders')
      .doc(orderID)
      .update({ customer_received: true })
    .then(() => console.log('updated to received'));
  };
};

export const markOrderCancelled= (orderID) => {
  return () => {
    firebase.firestore()
      .collection('orders')
      .doc(orderID)
      .update({ status: 300 })
    .then(() => console.log('updated 300'));
  };
};

// export const markOrderCustomerShown = (orderID) => {
//   return () => {
//     firebase.firestore()
//       .collection('orders')
//       .doc(orderID)
//       .update({ show_customer_receipt: false })
//     .then(() => console.log('updated seen by customer'));
//   };
// };
