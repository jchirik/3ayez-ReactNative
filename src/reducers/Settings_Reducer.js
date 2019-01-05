// handles everything to do with authentication
import {
  FIRST_LAUNCH_STATUS_SET,
  LOCALE_SET
} from '../actions/types';

const INITIAL_STATE = {
  locale: 'ar'
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case LOCALE_SET:
      return { ...state, locale: p.locale };
    default:
      return state;
  }
};
