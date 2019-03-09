
import {
  ADDRESS_SELECT_SUCCESS,
  ADDRESSES_SET,
  ADDRESSES_LISTENER_SET,
  CUSTOMER_DATA_RESET
} from '../actions/types';

const INITIAL_STATE = {
  address: null, // the working address
  addresses: [],
  addressesListener: null,
  is_loading: false
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case ADDRESS_SELECT_SUCCESS:
      return { ...state, address: p.address };
    case ADDRESSES_SET:
      return { ...state, addresses: p.addresses, is_loading: false };
    case ADDRESSES_LISTENER_SET:
      if (state.addressesListener !== null) { state.addressesListener(); }
      return { ...state, is_loading: true, addressesListener: p.addressesListener, addresses: [] };
    case CUSTOMER_DATA_RESET:
        if (state.addressesListener !== null) { state.addressesListener(); }
        return INITIAL_STATE;
    default:
      return state;
  }
};
