// handles everything to do with store
import {
  FEEDBACK_RESET,
  FEEDBACK_STORE_RATING_SET,
  FEEDBACK_AYEZ_RATING_SET,
  FEEDBACK_SELLER_SET,

  FEEDBACK_SUBMIT_BEGIN,
  FEEDBACK_SUBMIT_SUCCESS,
  FEEDBACK_SUBMIT_ERROR
} from '../actions/types';


const INITIAL_STATE = {
  store_rating: null,
  ayez_rating: null,

  seller: null,
  seller_loading: true,

  submit_loading: false,
  submit_success: false,
  submit_error: null
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case FEEDBACK_RESET:
      return INITIAL_STATE
    case FEEDBACK_STORE_RATING_SET:
      return { ...state, store_rating: p.store_rating };
    case FEEDBACK_AYEZ_RATING_SET:
      return { ...state, ayez_rating: p.ayez_rating };
    case FEEDBACK_SELLER_SET:
      return { ...state, seller: p.seller, seller_loading: false };
    case FEEDBACK_SUBMIT_BEGIN:
      return { ...state, submit_loading: true, submit_success: false, submit_error: null };
    case FEEDBACK_SUBMIT_SUCCESS:
      return { ...state, submit_loading: false, submit_success: true };
    case FEEDBACK_SUBMIT_ERROR:
      return { ...state, submit_loading: false, submit_error: p.error };
    default:
      return state;
  }
};
