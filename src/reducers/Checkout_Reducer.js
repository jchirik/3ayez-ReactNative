import {
  TIMESLOT_SET,
  TIP_SET,

  ORDER_NOTES_SET,
  PAYMENT_METHOD_SET,

  COUPON_CODE_SUCCESS,
  COUPON_CODE_RESET
} from '../actions/types';

const INITIAL_STATE = {
  notes: '',
  timeslot: null,
  payment_method: null,
  tip: null,
  delivery_fee: null
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
