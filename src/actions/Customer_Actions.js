
import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import { setPushToken } from './PushToken_Helpers';
import store from '../reducers';

import {
  CUSTOMER_DATA_SET,
  CUSTOMER_DATA_LISTENER_SET,
  CUSTOMER_DATA_RESET,

  ONGOING_ORDERS_SET,
  ONGOING_ORDERS_LISTENER_SET,
  REVIEW_ORDER_SET,
  FEEDBACK_ORDER_SET,
  ONGOING_ORDERS_RESET,

  ADDRESSES_SET,
  ADDRESSES_LISTENER_SET,

  CREDITCARDS_SET,
  CREDITCARDS_LISTENER_SET,

  AUTH_INIT,

  VERIFICATION_BEGIN,
  VERIFICATION_SUCCESS,
  VERIFICATION_FAIL
} from './types';


const completeVerification = (dispatch, user, prevUser) => {
  // get verification_loading, onProceed, prevUser from Auth
  const {
    onComplete
  } = store.getState().Auth;

  console.log('completeVerification', user, prevUser);

  dispatch({ type: VERIFICATION_BEGIN });

  // if previously logged in anonymously, run a CloudFX that migrates all data
  if (prevUser && prevUser.uid && (user.uid !== prevUser.uid)) {
    console.log('migrating guest account with phone account', prevUser.uid, user.uid);

    const migrateGuestAccount = firebase.functions().httpsCallable('migrateGuestAccount');
    migrateGuestAccount({ guest_uid: prevUser.uid, user_uid: user.uid }).then((result) => {
      if (result.data && result.data.success) {
        dispatch({ type: VERIFICATION_SUCCESS });
        if (onComplete) {
          console.log('completeVerification onComplete execute');
          onComplete();
        } else {
          console.log('completeVerification onComplete no_execute');
        }
      } else {
        dispatch({ type: VERIFICATION_FAIL, payload: { error: 'Failed to link guest account' } })
      }
    }).catch((error) => {
      dispatch({ type: VERIFICATION_FAIL, payload: { error: 'Failed to link guest account' } });
    });

  } else {
    // otherwise, its successful! continue.
    console.log('completeVerification no merge');
    dispatch({ type: VERIFICATION_SUCCESS });

    if (onComplete) {
      console.log('completeVerification onComplete execute');
      onComplete();
    } else {
      console.log('completeVerification onComplete no_execute');
    }
  }

}

export const listenCustomerAuthStatus = () => {
  return (dispatch) => {
    let prevUser = {};
    // after rendering, listen to auth status
    firebase.auth().onAuthStateChanged((user) => {
      if (user === prevUser) { return; }
      console.log('onAuthStateChanged prevUser', prevUser)
      if (user) {
        console.log('onAuthStateChanged', user);
        completeVerification(dispatch, user, prevUser);
        firebase.crashlytics().setUserIdentifier(user.uid);
        listenCustomerData(dispatch);
        listenToOngoingOrders(dispatch);
        listenToAddresses(dispatch);
        listenToCreditCards(dispatch);
        setPushToken(firebase.firestore().collection('customers').doc(user.uid));
        // dispatch({ type: AUTH_INIT, payload: { onComplete: null }});
      } else {
        console.log('onAuthStateChanged logged out');
        dispatch({ type: CUSTOMER_DATA_RESET });
        dispatch({ type: ONGOING_ORDERS_RESET });
        Actions.tutorial();
      }
      prevUser = user;
    });
  };
};

// detected a login & begin fetching customer account information
const listenCustomerData = (dispatch) => {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    dispatch({ type: CUSTOMER_DATA_SET, payload: { phone: currentUser.phoneNumber } });

    firebase.firestore()
      .collection('customers')
      .doc(currentUser.uid)
      .set({ phone: currentUser.phoneNumber }, { merge: true })
      .then(() => {
        console.log('set phone number');
      });
    // realtime listening
    const listener = firebase.firestore().collection('customers').doc(currentUser.uid)
        .onSnapshot((document) => {
          if (document.exists) {
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
      .where('is_timeslot_ongoing', '==', true);

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

      console.log('ONGOING_ORDERS_SET', orders)

      const review_order = orders.find(order => order.requires_review);
      dispatch({ type: REVIEW_ORDER_SET, payload: { review_order } });

      const feedback_order = orders.find(order => ((order.status === 200) && (!order.customer_feedback)));
      console.log('FEEDBACK_ORDER_SET', feedback_order)
      dispatch({ type: FEEDBACK_ORDER_SET, payload: { feedback_order } });
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
