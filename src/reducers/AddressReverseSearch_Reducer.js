
import {
  LOCATION_REVERSE_SEARCH_BEGIN, // get street from pin
  LOCATION_REVERSE_SEARCH_SET
} from '../actions/types';

const INITIAL_STATE = {
  title: '',
  type: '',
  request: null,
  is_loading: false
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case LOCATION_REVERSE_SEARCH_BEGIN:
      if (state.request) { state.request.abort() } // abort any previous request
      return { ...state, is_loading: true, request: p.request };
    case LOCATION_REVERSE_SEARCH_SET:
      return { ...state, is_loading: false, title: p.title, type: p.type };
    default:
      return state;
  }
};
