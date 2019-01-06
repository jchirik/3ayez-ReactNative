// handles everything to do with authentication
import {
  FIRST_LAUNCH_STATUS_SET,
  LOCALE_SET,
  DEVICEID_SET
} from '../actions/types';

const INITIAL_STATE = {
  locale: 'ar',
  device_id: null
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case DEVICEID_SET:
      return { ...state, device_id: p.device_id };
    case LOCALE_SET:
      return { ...state, locale: p.locale };
    default:
      return state;
  }
};
