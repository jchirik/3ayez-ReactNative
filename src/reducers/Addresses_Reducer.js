
import {
  ADDRESSES_SET,
  ADDRESS_INDEX_SET
} from '../actions/types';

const INITIAL_STATE = {
  addresses: null,
  address_index: null,
  is_loading: true
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case ADDRESSES_SET:
      return { ...state, addresses: p.addresses, is_loading: false };
    case ADDRESS_INDEX_SET:
      return { ...state, address_index: p.address_index };
    default:
      return state;
  }
};
