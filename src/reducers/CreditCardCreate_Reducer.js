
import {
  CREDITCARD_CREATE_BEGIN,
  CREDITCARD_CREATE_SUCCESS,
  CREDITCARD_CREATE_FAIL,
  CREDITCARD_CREATE_RESET
} from '../actions/types';

const INITIAL_STATE = {
  is_loading: false,
  success: false,
  error: null
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case CREDITCARD_CREATE_BEGIN:
      return { ...INITIAL_STATE, is_loading: true };
    case CREDITCARD_CREATE_SUCCESS:
      return { ...state, is_loading: false, success: true };
    case CREDITCARD_CREATE_FAIL:
      return { ...state, is_loading: false, error: p.error };
    case CREDITCARD_CREATE_RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
};
