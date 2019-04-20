
import {
  ADDRESS_CREATE_RESET,

  ADDRESS_LOCATION_BEGIN,
  ADDRESS_LOCATION_SET,

  CURRENT_LOCATION_BEGIN,

  ADDRESS_DETAIL_SET,

  ADDRESS_SUBMIT_BEGIN,
  ADDRESS_SUBMIT_SUCCESS,
  ADDRESS_SUBMIT_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  location: null,

  title: '',
  street: '',
  building: '', // merge with floor
  apt: '',
  name: '',
  notes: '',
  type: 'HOME',
  area: null,

  is_loading: false,
  error: null
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case ADDRESS_CREATE_RESET:
      return { ...INITIAL_STATE };
    case CURRENT_LOCATION_BEGIN:
      return { ...state, location: null };
    case ADDRESS_LOCATION_BEGIN:
      return { ...state, location: null };
    case ADDRESS_LOCATION_SET:
      return { ...state, location: p.location };
    case ADDRESS_DETAIL_SET:
      return { ...state, ...p };
    case ADDRESS_SUBMIT_BEGIN:
      return { ...state, is_loading: true };
    case ADDRESS_SUBMIT_SUCCESS:
      return { ...state, is_loading: false };
    case ADDRESS_SUBMIT_ERROR:
      return { ...state, is_loading: false, error: p.error };
    default:
      return state;
  }
};



// case UPDATE_WORKING_ADDRESS:
// state[p.key] = p.value;
// return { ...state };
// case FETCH_MAP_POINT_BEGIN:
// return { ...state, point: null };
// case FETCH_MAP_POINT_END:
// return { ...state, point: p.point };
