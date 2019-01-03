
import {
  ADDRESS_SEARCH_RESET,
  ADDRESS_SEARCH_BEGIN,
  ADDRESS_SEARCH_SET
} from '../actions/types';

const INITIAL_STATE = {
  query: '',
  request: null,
  is_loading: false,
  results: []
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case ADDRESS_SEARCH_RESET: // if search is cleared
      if (state.request) { state.request.abort() } // abort any previous request
      return { ...INITIAL_STATE };
    case ADDRESS_SEARCH_BEGIN:
      if (state.request) { state.request.abort() } // abort any previous request
      return { ...state, is_loading: true, query: p.query, request: p.request };
    case ADDRESS_SEARCH_SET:
      return { ...state, is_loading: false, results: p.results };
    default:
      return state;
  }
};
