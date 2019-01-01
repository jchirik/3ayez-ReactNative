import {
  LOAD_BASKETS,
  RECHECK_PRICES,
  SELLER_SELECT,

  BASKET_INIT,
  BASKET_ITEM_INCR,
  BASKET_ITEM_DECR,
  BASKET_ITEMS_CLEAR
} from '../actions/types';

import { saveBaskets, incrementItem } from './Baskets_Helpers'

const INITIAL_STATE = {
  baskets: {}
};

const NEW_BASKET = {
  items_array: [],
  subtotal: 0,
  basket_quantity: 0
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;

  // rehydrate from persistent storage
  if (action.type === LOAD_BASKETS) {
    return { baskets: p.baskets };
  }

  if (!p || !p.seller_id) { return state; }
  const seller_id = p.seller_id;

  const baskets = { ...state.baskets }
  switch (action.type) {
    case BASKET_INIT:
      if (!baskets[seller_id] || !baskets[seller_id].items_array) {
        baskets[seller_id] = { ...NEW_BASKET }
      }
      return saveBaskets(baskets);
    case BASKET_ITEM_INCR:
      baskets[seller_id] = incrementItem(baskets[seller_id], p.item, +(p.item.incr || 1));
      return saveBaskets(baskets);
    case BASKET_ITEM_DECR:
      baskets[seller_id] = incrementItem(baskets[seller_id], p.item, -(p.item.incr || 1));
      return saveBaskets(baskets);
    case BASKET_ITEMS_CLEAR: // if customer clears basket
      baskets[seller_id] = { ...NEW_BASKET };
      return saveBaskets(baskets);
    default:
      return state;
  }
};
