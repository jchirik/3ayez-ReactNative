import {
  COUPON_CODE_LOADING,
  COUPON_CODE_SUCCESS,
  COUPON_CODE_FAILURE,
  COUPON_CODE_RESET
} from '../actions/types';

const INITIAL_STATE = {
  coupon: null,
  is_loading: false,
  error: null
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case COUPON_CODE_LOADING:
      return { ...INITIAL_STATE, is_loading: true };
    case COUPON_CODE_SUCCESS:
      return { ...state, is_loading: false, coupon: p.coupon };
    case COUPON_CODE_FAILURE:
      return { ...state, is_loading: false, error: p.error };
    case COUPON_CODE_RESET:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};
