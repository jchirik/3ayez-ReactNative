
import {
  ADDRESS_LOCATION_SET,

  ADDRESS_AREA_BEGIN,
  ADDRESS_AREA_SET,
  ADDRESS_AREA_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  is_loading: false,
  error: null
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case ADDRESS_LOCATION_SET:
      return INITIAL_STATE;
    case ADDRESS_AREA_BEGIN:
      return { ...state, is_loading: true };
    case ADDRESS_AREA_SET:
      return { ...INITIAL_STATE };
    case ADDRESS_AREA_ERROR:
      return { ...state, is_loading: false, error: p.error };
    default:
      return state;
  }
};
