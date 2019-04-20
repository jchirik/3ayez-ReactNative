import {
  SELLERS_FETCH_BEGIN,
  SELLERS_FETCH_END,
  SELLERS_FETCH_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  sellers: [],
  is_loading: false,
  error: false
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case SELLERS_FETCH_BEGIN:
      return { ...INITIAL_STATE, is_loading: true, is_loading_beststore: true, is_loading_bestprices: true };
    case SELLERS_FETCH_END:
      return { ...state, is_loading: false, sellers: p.sellers };
    case SELLERS_FETCH_ERROR:
      return { ...state, is_loading: false, error: true };
    default:
      return state;
  }
};
