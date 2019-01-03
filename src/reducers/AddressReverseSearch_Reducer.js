
import {
  LOCATION_REVERSE_SEARCH_BEGIN, // get street from pin
  LOCATION_REVERSE_SEARCH_SET
} from '../actions/types';

const INITIAL_STATE = {
  query: '',
  is_loading: false
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case LOCATION_REVERSE_SEARCH_BEGIN:
      return { ...state, is_loading: true, query: p.query };
    case LOCATION_REVERSE_SEARCH_SET:
      if (p.query === state.query) {
        // stop loading once the last query's response returns
        return { ...state, is_loading: false };
      }
    default:
      return state;
  }
};
