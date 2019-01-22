
import {
  ADDRESS_CREATE_RESET,
  ADDRESS_REGION_SET,
  ADDRESS_LOCATION_SET,

  ADDRESS_DETAIL_SET,

  ADDRESS_SUBMIT_BEGIN,
  ADDRESS_SUBMIT_SUCCESS,
  ADDRESS_SUBMIT_FAILURE
} from '../actions/types';

const INITIAL_STATE = {
  region: '',
  point: null,

  title: '',
  street: '',
  building: '', // merge with floor
  apt: '',
  notes: '',
  type: 'HOME',

  is_loading: false
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
    case ADDRESS_DETAIL_SET:
      return { ...state, ...p };
    case ADDRESS_SUBMIT_BEGIN:
      return { ...state, is_loading: true };
    case ADDRESS_SUBMIT_SUCCESS:
      return { ...state, is_loading: false };
    case ADDRESS_SUBMIT_FAILURE:
      return { ...state, is_loading: false };
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
