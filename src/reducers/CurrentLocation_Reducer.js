
import {
  CURRENT_LOCATION_BEGIN,
  CURRENT_LOCATION_SET,
  CURRENT_LOCATION_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  is_loading: false,
  error: null
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case CURRENT_LOCATION_BEGIN:
      return { ...state, is_loading: true };
    case CURRENT_LOCATION_SET:
      return { ...state, is_loading: false };
    case CURRENT_LOCATION_ERROR:
        return { ...state, is_loading: false, error: p.error };
    default:
      return state;
  }
};
