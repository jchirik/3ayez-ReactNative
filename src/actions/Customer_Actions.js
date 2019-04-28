
import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import { setPushToken } from './PushToken_Helpers';
import { AppEventsLogger } from 'react-native-fbsdk';
import store from '../reducers';
import { sceneKeys, navigateTo, navigateBackTo } from '../router';
import appsFlyer from 'react-native-appsflyer';

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


  // if previously logged in anonymously, run a CloudFX that migrates all data
  if (prevUser && prevUser.uid && (user.uid !== prevUser.uid)) {
    console.log('migrating guest account with phone account', prevUser.uid, user.uid);

    const migrateGuestAccount = firebase.functions().httpsCallable('migrateGuestAccountv2');
    migrateGuestAccount({ guest_uid: prevUser.uid, user_uid: user.uid }).then((result) => {
      // if (result.data && result.data.success) {
      dispatch({ type: VERIFICATION_SUCCESS });
      if (onComplete) {
        console.log('completeVerification onComplete execute');
        onComplete();

      } else {
        console.log('completeVerification onComplete no_execute');
      }
      // // } else {
      //   dispatch({ type: VERIFICATION_FAIL, payload: { error: 'Failed to link guest account' } })
      // }
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

        if (!user.isAnonymous) {
          firebase.analytics().logEvent("LOGGED_IN");
          AppEventsLogger.logEvent('LOGGED_IN');
          appsFlyer.trackEvent('LOGGED_IN', { uid: user.uid })
        }
        // dispatch({ type: AUTH_INIT, payload: { onComplete: null }});
      } else {
        console.log('onAuthStateChanged logged out');
        dispatch({ type: CUSTOMER_DATA_RESET });
        dispatch({ type: ONGOING_ORDERS_RESET });
        navigateTo(sceneKeys.tutorial);

        firebase.analytics().logEvent("LOGGED_OUT");
        AppEventsLogger.logEvent('LOGGED_OUT');
        appsFlyer.trackEvent('LOGGED_OUT', {})

      }
      prevUser = user;
    });
  };
};



const generateReferralCode = (uid, isAnonymous, referral_code) => {
  console.log('isAnonymous', isAnonymous)
  if (uid && !isAnonymous && !referral_code) {
    const generateReferralCode = firebase.functions().httpsCallable('generateReferralCode');
    generateReferralCode({ customer_id: uid }).then((result) => {
      console.log('Successful generation', result);

      try {
        firebase.analytics().logEvent("GENERATED_REFERRAL_CODE");
        AppEventsLogger.logEvent('GENERATED_REFERRAL_CODE');
        appsFlyer.trackEvent('GENERATED_REFERRAL_CODE', { })
      } catch (e) {
        console.log('AppEventsLogger error', e)
      }

    }).catch((error) => {
      console.log(error);
    });
  }
};





// const fetchSavedAreas = (dispatch) => {
//   const { currentUser } = firebase.auth();
//   dispatch({ type: SAVED_AREAS_BEGIN });
//   console.log('fetchCustomerSavedAreas BEGIN')
//
//   const fetchCustomerSavedAreas = firebase.functions().httpsCallable('fetchCustomerSavedAreas');
//   fetchCustomerSavedAreas({ customer_id: currentUser.uid }).then((result) => {
//     console.log('fetchCustomerSavedAreas returned', result)
//     if (result.data) {
//       const saved_areas = result.data.saved_areas;
//
//       if (!saved_areas.length) {
//         navigateTo(sceneKeys.areaCreate);
//       }
//       dispatch({ type: SAVED_AREAS_SET, payload: { saved_areas } });
//     } else {
//       dispatch({ type: SAVED_AREAS_FAIL, payload: { error: 'Bad result' } });
//     }
//   }).catch((error) => {
//     console.log('fetchCustomerSavedAreas error', error);
//     dispatch({ type: SAVED_AREAS_FAIL, payload: { error } });
//   });
// };






// detected a login & begin fetching customer account information
const listenCustomerData = (dispatch) => {
  const { currentUser } = firebase.auth();
  if (currentUser) {
    // dispatch({ type: CUSTOMER_DATA_SET, payload: { phone: currentUser.phoneNumber } });
    // realtime listening
    const listener = firebase.firestore().collection('customers').doc(currentUser.uid)
        .onSnapshot((document) => {
          if (document.exists) {
            const payload = document.data();
            console.log('listenCustomerData', payload)
            // fetchSavedAreas(dispatch);
            dispatch({ type: CUSTOMER_DATA_SET, payload });
          }
    });
    const balanceListener = firebase.firestore().collection('balances').doc(currentUser.uid)
        .onSnapshot((document) => {
          if (document.exists) {
            const payload = document.data();
            console.log('balanceListenCustomerData', payload)
            dispatch({ type: CUSTOMER_DATA_SET, payload });
            generateReferralCode(currentUser.uid, currentUser.isAnonymous, payload.referral_code)
          } else {
            generateReferralCode(currentUser.uid, currentUser.isAnonymous, null)
          }
    });

    // firebase.firestore()
    //   .collection('customers')
    //   .doc(currentUser.uid)
    //   .set({ phone: currentUser.phoneNumber }, { merge: true })
    //   .then(() => {
    //     console.log('set phone number');
    //   });
    dispatch({ type: CUSTOMER_DATA_LISTENER_SET, payload: { listener, balanceListener } });
  }
};



const listenToOngoingOrders = (dispatch) => {
  // ensure there is a current user & seller
  const { currentUser } = firebase.auth();
  if (currentUser) {
    // realtime listening
    const ongoingOrdersRef = firebase.firestore().collection('orders')
      .where('customer.id', '==', currentUser.uid)
      .where('is_customer_active', '==', true);

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

      const activeOrders = orders.filter(order => ((order.timeslot.end + 18000000) > Date.now()) && !order.customer_feedback)
      dispatch({ type: ONGOING_ORDERS_SET, payload: { orders: activeOrders } });

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
      let addresses = [];
      addressesT.docs.forEach(addressDoc => {
        const id = addressDoc.id;
        const data = addressDoc.data();
        if (data.location && data.street && data.name) {
          addresses.push({
            ...data,
            id
          });
        }
      });

      // get the most recent address that was selected (greatest timestamp)

      addresses = addresses.sort((a, b) => { return b.timestamp - a.timestamp })
      console.log('ADDRESSES', addresses);

      dispatch({ type: ADDRESSES_SET, payload: { addresses } });
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
        const card_id = card.id;
        const data = card.data();
        return ({ ...data, card_id, type: 'CREDIT' });
      });
      dispatch({ type: CREDITCARDS_SET, payload: { credit_cards } });
    });
    dispatch({ type: CREDITCARDS_LISTENER_SET, payload: { creditCardsListener } });
  }
};
