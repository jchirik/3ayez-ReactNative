import {
  SELLERS_FETCH_BEGIN,
  SELLERS_FETCH_END,
  SELLERS_FETCH_ERROR,

  SELLERS_FETCH_BESTSTORE_END,
  SELLERS_FETCH_BESTPRICES_END
} from '../actions/types';

const INITIAL_STATE = {
  sellers: [],
  area: null,
  is_loading: false,
  error: false,

  is_loading_beststore: false,
  is_loading_bestprices: false
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case SELLERS_FETCH_BEGIN:
      return { ...INITIAL_STATE, is_loading: true, is_loading_beststore: true, is_loading_bestprices: true };
    case SELLERS_FETCH_END:
      return { ...state, is_loading: false, area: p.area, sellers: p.sellers };
    case SELLERS_FETCH_ERROR:
      return { ...state, is_loading: false, error: true };
    case SELLERS_FETCH_BESTSTORE_END:
      return { ...state, is_loading_beststore: false };
    case SELLERS_FETCH_BESTPRICES_END:
      return { ...state, is_loading_bestprices: false };
    default:
      return state;
  }
};
