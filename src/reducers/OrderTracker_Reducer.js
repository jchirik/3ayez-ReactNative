import {
  ORDER_TRACK_LISTENER_SET,
  ORDER_TRACK_DATA_SET,
  ORDER_ITEMS_TRACK_DATA_SET,
  ORDER_TRACK_LISTENER_RESET
} from '../actions/types';

const INITIAL_STATE = {
  id: null,
  order_number: '',

  items: null,

  orderListener: null,
  itemsListener: null,
  order_loading: false,
  items_loading: false
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case ORDER_TRACK_LISTENER_SET:
      if (state.orderListener !== null) { state.orderListener(); }
      if (state.itemsListener !== null) { state.itemsListener(); }
      return { orderListener: p.orderListener, itemsListener: p.itemsListener, order_loading: true, items_loading: true };
    case ORDER_TRACK_DATA_SET:
      return { ...state, ...p.order, order_loading: false };
    case ORDER_ITEMS_TRACK_DATA_SET:
      return { ...state, items: p.items, items_loading: false };
    case ORDER_TRACK_LISTENER_RESET:
      if (state.orderListener !== null) { state.orderListener(); }
      if (state.itemsListener !== null) { state.itemsListener(); }
      return INITIAL_STATE;
    default:
      return state;
  }
};
