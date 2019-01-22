// handles everything to do with authentication
import {
  CUSTOMER_DATA_SET,
  CUSTOMER_DATA_LISTENER_SET,
  CUSTOMER_DATA_RESET
} from '../actions/types';

const INITIAL_STATE = {
  logged_in: false,
  name: '',
  phone: '',

  listener: null
};

// reducer must return a new object!!!
// javascript will compare state object to previous
//    difference triggers an update
//    MUST return a NEW state object (not an update)

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case CUSTOMER_DATA_SET:
      return { ...state, ...p, logged_in: true };
    case CUSTOMER_DATA_LISTENER_SET:
      if (state.listener !== null) { state.listener(); }
      return { ...state, listener: p.listener };
    case CUSTOMER_DATA_RESET:
        if (state.listener !== null) { state.listener(); }
        return INITIAL_STATE;
    default:
      return state;
  }
};
