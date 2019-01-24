import {
  CHECKOUT_RESET,
  TIMESLOT_SET,
  TIP_SET,

  ORDER_NOTES_SET,
  PAYMENT_METHOD_SET,

  COUPON_CODE_SUCCESS,
  COUPON_CODE_RESET,

  ORDER_SUBMIT_BEGIN,
  ORDER_SUBMIT_SUCCESS,
  ORDER_SUBMIT_FAIL
} from '../actions/types';

const INITIAL_STATE = {
  notes: '',
  timeslot: null,
  payment_method: { type: 'CASH' },
  tip: 0.0,
  delivery_fee: 0.0,

  is_loading: false,
  error: false
};
/* ONLY THINGS YOU USE IN CHECKOUT FLOW */
// (reset every time checkout flow opens)

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
    case ORDER_SUBMIT_BEGIN:
      return { ...state, is_loading: true, error: false };
    case ORDER_SUBMIT_SUCCESS:
      return { ...state, is_loading: false };
    case ORDER_SUBMIT_FAIL:
      return { ...state, is_loading: false, error: true };
    case CHECKOUT_RESET:
      return INITIAL_STATE;
    case TIP_SET:
      return { ...state, tip: p.tip };
    case TIMESLOT_SET:
      return { ...state, timeslot: p.timeslot, delivery_fee: p.delivery_fee };
    case PAYMENT_METHOD_SET:
      return { ...state, payment_method: p.payment_method };
    case ORDER_NOTES_SET:
      return { ...state, notes: p.notes };
    default:
      return state;
  }
};
