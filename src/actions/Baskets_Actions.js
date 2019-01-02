

import { AsyncStorage } from 'react-native';
import { playSound, SOUND_SWOOSH } from './sounds'
import {
  LOAD_BASKETS,
  RECHECK_PRICES,

  BASKET_ITEM_INCR,
  BASKET_ITEM_DECR,
  BASKET_ITEMS_CLEAR
} from './types';


export const loadBaskets = () => {
  return (dispatch) => {
    AsyncStorage.getItem('WORKING_BASKETS', (err, baskets_t) => {
      if (baskets_t && JSON.parse(baskets_t)) {
        const baskets = JSON.parse(baskets_t);
        console.log('loadBaskets', baskets)
        dispatch({
          type: LOAD_BASKETS,
          payload: { baskets }
        });
      }
    });
  }
}

export const addToBasket = (item, seller_id) => {
  playSound(SOUND_SWOOSH);
  return { type: BASKET_ITEM_INCR, payload: { item, seller_id } };
};

export const removeFromBasket = (item, seller_id) => {
  return { type: BASKET_ITEM_DECR, payload: { item, seller_id } };
};

export const emptyBasket = (seller_id) => {
  return { type: BASKET_ITEMS_CLEAR, payload: { seller_id } };
};
