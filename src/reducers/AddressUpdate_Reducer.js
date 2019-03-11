
import {
  ADDRESS_UPDATE_BEGIN,
  ADDRESS_UPDATE_ERROR,
  ADDRESS_UPDATE_SUCCESS,
} from '../actions/types';

const INITIAL_STATE = {
  is_loading: false,
  error: null
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case ADDRESS_UPDATE_BEGIN:
      return { ...state, is_loading: true };
    case ADDRESS_UPDATE_SUCCESS:
      return { ...state, is_loading: false };
    case ADDRESS_UPDATE_ERROR:
      return { ...state, is_loading: false, error: p.error };
    default:
      return state;
  }
};
