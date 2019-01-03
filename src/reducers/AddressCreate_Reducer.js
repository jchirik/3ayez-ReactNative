
import {
  ADDRESS_CREATE_RESET,
  ADDRESS_REGION_SET,
  ADDRESS_LOCATION_SET,
  CURRENT_LOCATION_SET,
  ADDRESS_DETAILS_SET,
  LOCATION_REVERSE_SEARCH_SET
} from '../actions/types';

const INITIAL_STATE = {
  region: '',
  point: null,

  street: '',

  building: '', // merge with floor
  apt: '',
  notes: '',
  type: 'HOME'
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case ADDRESS_CREATE_RESET:
      return { ...INITIAL_STATE };
    case ADDRESS_REGION_SET:
      return { ...state, region: p.region };
    case ADDRESS_LOCATION_SET:
      return { ...state, point: p.point };
    case CURRENT_LOCATION_SET:
      return { ...state, point: p.point };
    case LOCATION_REVERSE_SEARCH_SET:
      return { ...state, street: p.street };
    case ADDRESS_DETAILS_SET:
      return { ...state, ...p.details };
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
