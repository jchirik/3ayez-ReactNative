import {
  TIMESLOTS_FETCH_BEGIN,
  TIMESLOTS_FETCH_SET,
  TIMESLOTS_FETCH_ERROR
} from '../actions/types';

// selected timeslot saved in the CHECKOUT reducer

const INITIAL_STATE = {
  loading: false,
  error: false,
  timeslots: []
};

// only missing from an order to send:
//  address
//  seller
//  customer
//  coupon
//  items_array: [],
//  subtotal: 0,
//  basket_quantity: 0,

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case TIMESLOTS_FETCH_BEGIN:
      return { ...INITIAL_STATE, loading: true };
    case TIMESLOTS_FETCH_SET:
      return { ...state, loading: false, timeslots: p.timeslots };
    case TIMESLOTS_FETCH_ERROR:
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
};
