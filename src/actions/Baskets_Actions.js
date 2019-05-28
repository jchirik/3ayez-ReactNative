

import firebase from 'react-native-firebase';
import { AppEventsLogger } from 'react-native-fbsdk';
import { AsyncStorage } from 'react-native';
import { playSound, SOUND_SWOOSH } from './sounds'
import {
  LOAD_BASKETS,
  RECHECK_PRICES,

  BASKET_ITEM_INCR,
  BASKET_ITEM_DECR,
  BASKET_ITEMS_CLEAR,

  BASKET_ITEM_SPECIAL_REQ
} from './types';


// export const loadBaskets = () => {
//   return (dispatch) => {
//     console.log('init')
//     // AsyncStorage.getItem('WORKING_BASKETS', (err, baskets_t) => {
//     //   if (baskets_t && JSON.parse(baskets_t)) {
//     //     const baskets = JSON.parse(baskets_t);
//     //     console.log('loadBaskets', baskets)
//     //     dispatch({
//     //       type: LOAD_BASKETS,
//     //       payload: { baskets }
//     //     });
//     //   }
//     // });
//   }
// }

export const saveItemSpecialRequests = (upc, seller_id, special_requests) => {
  return { type: BASKET_ITEM_SPECIAL_REQ, payload: { upc, seller_id, special_requests } };
};

export const addToBasket = (item, seller_id) => {
  playSound(SOUND_SWOOSH);

  firebase.analytics().logEvent("ADD_TO_BASKET");
  AppEventsLogger.logEvent('ADD_TO_BASKET');

  return { type: BASKET_ITEM_INCR, payload: { item, seller_id } };
};

export const removeFromBasket = (item, seller_id) => {
  return { type: BASKET_ITEM_DECR, payload: { item, seller_id } };
};

export const emptyBasket = (seller_id) => {
  return { type: BASKET_ITEMS_CLEAR, payload: { seller_id } };
};
