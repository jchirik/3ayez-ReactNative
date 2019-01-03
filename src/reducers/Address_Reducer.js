
import {
  ADDRESS_SET
} from '../actions/types';

const INITIAL_STATE = {
  id: null,
  point: {},
  name: '',
  street: '',
  building: '',
  floor: '',
  apt: '',
  notes: '',
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case ADDRESS_SET:
      return { ...p };
    default:
      return state;
  }
};
