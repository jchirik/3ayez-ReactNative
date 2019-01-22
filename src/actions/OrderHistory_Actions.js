/*
CustomerData_Actions.js
*/

import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';

import {
  ORDER_HISTORY_FETCH_BEGIN,
  ORDER_HISTORY_FETCH_SET
} from './types';


export const fetchOrderHistory = () => {
  // ensure there is a current user & seller
  const { currentUser } = firebase.auth();
  return (dispatch) => {
    if (currentUser) {
      dispatch({ type: ORDER_HISTORY_FETCH_BEGIN });

      const orderHistoryRef = firebase.firestore().collection('orders')
        .where('customer.id', '==', currentUser.uid)
        .orderBy('timestamp', 'desc')
        .limit(30);

      orderHistoryRef.get().then((orderHistoryT) => {
        let orders = orderHistoryT.docs.map(order => {
          const id = order.id;
          const data = order.data();
          return ({
            ...data,
            id,
            status_log: data.status_log ? data.status_log : []
          });
        });
        orders = orders.sort((orderA, orderB) => { return orderB.timestamp - orderA.timestamp } );
        dispatch({ type: ORDER_HISTORY_FETCH_SET, payload: { orders } });
      });
    }
  };
};

// export const endListeningOrderHistory = () => {
//   return (dispatch) => {
//     dispatch({ type: ORDER_HISTORY_LISTENER_RESET });
//   };
// };
