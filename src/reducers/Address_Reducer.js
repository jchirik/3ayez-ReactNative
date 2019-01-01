
import {
  UPDATE_WORKING_ADDRESS,
  RESET_WORKING_ADDRESS,
  FETCH_MAP_POINT_BEGIN,
  FETCH_MAP_POINT_END
} from '../actions/types';

const INITIAL_STATE = {
  id: null,
  point: null,
  name: '',
  street: '',
  building: '',
  floor: '',
  apt: '',
  notes: ''
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case RESET_WORKING_ADDRESS:
      return INITIAL_STATE;
    case UPDATE_WORKING_ADDRESS:
      state[p.key] = p.value;
      return { ...state };
    case FETCH_MAP_POINT_BEGIN:
      return { ...state, point: null };
    case FETCH_MAP_POINT_END:
      return { ...state, point: p.point };
    default:
      return state;
  }
};
