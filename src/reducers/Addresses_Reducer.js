
import {
  ADDRESSES_SET,
  ADDRESSES_LISTENER_SET,
  CUSTOMER_DATA_RESET
} from '../actions/types';

const INITIAL_STATE = {
  address: null, // the working address
  addresses: {},
  addressesListener: null,
  is_loading: true
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case ADDRESSES_SET:
      return { ...state, addresses: p.addresses, address: p.address, is_loading: false };
    case ADDRESSES_LISTENER_SET:
      if (state.addressesListener !== null) { state.addressesListener(); }
      return { ...INITIAL_STATE, addressesListener: p.addressesListener };
    case CUSTOMER_DATA_RESET:
        if (state.addressesListener !== null) { state.addressesListener(); }
        return INITIAL_STATE;
    default:
      return state;
  }
};
