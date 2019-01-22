import {
  ONGOING_ORDERS_SET,
  ONGOING_ORDERS_LISTENER_SET,
  REVIEW_ORDER_SET,
  ONGOING_ORDERS_RESET
} from '../actions/types';

const INITIAL_STATE = {
  review_order: null,
  orders: [],
  ongoingOrdersListener: null,

  loading: false
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case ONGOING_ORDERS_SET:
      return { ...state, orders: p.orders, loading: false };
    case REVIEW_ORDER_SET:
      return { ...state, review_order: p.review_order };
    case ONGOING_ORDERS_LISTENER_SET:
      if (state.ongoingOrdersListener !== null) { state.ongoingOrdersListener(); }
      return { ...state, ongoingOrdersListener: p.ongoingOrdersListener, loading: true };
    case ONGOING_ORDERS_RESET:
        if (state.ongoingOrdersListener !== null) { state.ongoingOrdersListener(); }
        return INITIAL_STATE;
    default:
      return state;
  }
};
