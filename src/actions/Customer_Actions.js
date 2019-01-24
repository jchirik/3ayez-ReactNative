
import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import { setPushToken } from './PushToken_Helpers';

import {
  CUSTOMER_DATA_SET,
  CUSTOMER_DATA_LISTENER_SET,
  CUSTOMER_DATA_RESET,

  ONGOING_ORDERS_SET,
  ONGOING_ORDERS_LISTENER_SET,
  REVIEW_ORDER_SET,
  ONGOING_ORDERS_RESET,

  ADDRESSES_SET,
  ADDRESSES_LISTENER_SET,

  CREDITCARDS_SET,
  CREDITCARDS_LISTENER_SET
} from './types';

export const listenCustomerAuthStatus = () => {
  return (dispatch) => {
    // after rendering, listen to auth status
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('onAuthStateChanged', user);
        firebase.crashlytics().setUserIdentifier(user.uid);
        listenCustomerData(dispatch);
        listenToOngoingOrders(dispatch);
        listenToAddresses(dispatch);
        listenToCreditCards(dispatch);
        setPushToken(firebase.firestore().collection('customers').doc(user.uid));
      } else {
        console.log('onAuthStateChanged logged out');
        dispatch({ type: CUSTOMER_DATA_RESET });
        dispatch({ type: ONGOING_ORDERS_RESET });
        Actions.tutorial();
      }
    });
  };
};

// detected a login & begin fetching customer account information
const listenCustomerData = (dispatch) => {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    // realtime listening
    const listener = firebase.firestore().collection('customers').doc(currentUser.uid)
        .onSnapshot((document) => {
          if (!document.exists) {
            // if the user's data document doesnt exist yet, create it!
            firebase.firestore()
              .collection('customers')
              .doc(currentUser.uid)
              .set({ phone: currentUser.phoneNumber }, { merge: true })
              .then(() => {
                console.log('created user in database');
              });
            dispatch({ type: CUSTOMER_DATA_SET, payload: { phone: currentUser.phoneNumber } });
          } else {
            const payload = document.data();
            console.log('listenCustomerData', payload)
            dispatch({ type: CUSTOMER_DATA_SET, payload });
          }
        });
    dispatch({ type: CUSTOMER_DATA_LISTENER_SET, payload: { listener } });
  }
};











const listenToOngoingOrders = (dispatch) => {
  // ensure there is a current user & seller
  const { currentUser } = firebase.auth();
  if (currentUser) {
    // realtime listening
    const ongoingOrdersRef = firebase.firestore().collection('orders')
      .where('customer.id', '==', currentUser.uid)
      .where('within_4_hours', '==', true);

    const ongoingOrdersListener = ongoingOrdersRef.onSnapshot((ongoingOrdersT) => {
      let orders = ongoingOrdersT.docs.map(order => {
        const id = order.id;
        const data = order.data();
        return ({
          ...data,
          id,
          status_log: data.status_log ? data.status_log : []
        });
      });
      // activeOrders = activeOrders.filter(order => (order.status !== 300));
      dispatch({ type: ONGOING_ORDERS_SET, payload: { orders } });

      const review_order = orders.find(order => order.requires_review);
      dispatch({ type: REVIEW_ORDER_SET, payload: { review_order } });
    });

    dispatch({ type: ONGOING_ORDERS_LISTENER_SET, payload: { ongoingOrdersListener } });
  }
};


const listenToAddresses = (dispatch) => {
  // ensure there is a current user & seller
  const { currentUser } = firebase.auth();
  if (currentUser) {
    // realtime listening
    const addressesRef = firebase.firestore().collection('customers').doc(currentUser.uid)
      .collection('addresses');

    const addressesListener = addressesRef.onSnapshot((addressesT) => {
      let addresses = addressesT.docs.map(addressDoc => {
        const id = addressDoc.id;
        const data = addressDoc.data();
        return ({
          ...data,
          id
        });
      });

      // get the most recent address that was selected (greatest timestamp)
      let address = null;
      if (addresses.length) {
        address = addresses[0];
        for (var i = 1; i < addresses.length; i++) {
            if (addresses[i].timestamp > address.timestamp) {
                address = addresses[i];
            }
        }
      }
      dispatch({ type: ADDRESSES_SET, payload: { addresses, address } });
    });

    dispatch({ type: ADDRESSES_LISTENER_SET, payload: { addressesListener } });
  }
};

const listenToCreditCards = (dispatch) => {
  // ensure there is a current user & seller
  const { currentUser } = firebase.auth();
  if (currentUser) {
    // realtime listening
    const creditCardsRef = firebase.firestore().collection('customers').doc(currentUser.uid)
      .collection('cards');
    const creditCardsListener = creditCardsRef.onSnapshot((creditCardsT) => {
      const credit_cards = creditCardsT.docs.map(card => {
        const id = card.id;
        const data = card.data();
        return ({ ...data, id, type: 'CREDIT' });
      });
      dispatch({ type: CREDITCARDS_SET, payload: { credit_cards } });
    });
    dispatch({ type: CREDITCARDS_LISTENER_SET, payload: { creditCardsListener } });
  }
};
