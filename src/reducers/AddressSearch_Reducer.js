
import {
  ADDRESS_SEARCH_RESET,
  ADDRESS_SEARCH_BEGIN,
  ADDRESS_SEARCH_SET
} from '../actions/types';

const INITIAL_STATE = {
  query: '',
  is_loading: false,
  results: []
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case ADDRESS_SEARCH_RESET: // if search is cleared
      return { ...INITIAL_STATE };
    case ADDRESS_SEARCH_BEGIN:
      return { ...state, is_loading: true, query: p.query };
    case ADDRESS_SEARCH_SET:
      if (p.query === state.query) {
        return { ...state, is_loading: false, results: p.results };
      }
    default:
      return state;
  }
};
