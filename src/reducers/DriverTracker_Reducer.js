import {
  DRIVER_TRACK_LISTENER_SET,
  DRIVER_TRACK_DATA_SET,
  DRIVER_TRACK_LISTENER_RESET
} from '../actions/types';

const INITIAL_STATE = {
  id: null,
  location: null,

  driver_loading: false,
  driverListener: null
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case DRIVER_TRACK_LISTENER_SET:
      if (state.driverListener !== null) { state.driverListener(); }
      return { ...state, driverListener: p.driverListener, driver_loading: true };
    case DRIVER_TRACK_DATA_SET:
      return { ...state, ...p.driver, driver_loading: false };
    case DRIVER_TRACK_LISTENER_RESET:
      if (state.driverListener !== null) { state.driverListener(); }
      return INITIAL_STATE;
    default:
      return state;
  }
};
