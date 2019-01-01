import {
  SELLERS_FETCH_BEGIN,
  SELLERS_FETCH_END
} from '../actions/types';

const INITIAL_STATE = {
  sellers: [],
  is_loading: false,
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case SELLERS_FETCH_BEGIN:
      return { ...INITIAL_STATE, is_loading: true };
    case SELLERS_FETCH_END:
      return { ...state, is_loading: false, sellers: p.sellers };
    default:
      return state;
  }
};
