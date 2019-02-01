
import {
  ADDRESS_SELECT_BEGIN,
  ADDRESS_SELECT_SUCCESS,
  ADDRESS_SELECT_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  is_loading: false,
  error: null
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case ADDRESS_SELECT_BEGIN:
      return { ...state, is_loading: true };
    case ADDRESS_SELECT_SUCCESS:
      return { ...INITIAL_STATE };
    case ADDRESS_SELECT_ERROR:
      return { ...state, is_loading: false, error: p.error };
    default:
      return state;
  }
};
