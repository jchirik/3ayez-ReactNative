import {
  ORDER_HISTORY_FETCH_BEGIN,
  ORDER_HISTORY_FETCH_SET
} from '../actions/types';

const INITIAL_STATE = {
  orders: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case ORDER_HISTORY_FETCH_BEGIN:
      return { ...INITIAL_STATE, loading: true };
    case ORDER_HISTORY_FETCH_SET:
      return { ...state, orders: p.orders, loading: false };
    default:
      return state;
  }
};
