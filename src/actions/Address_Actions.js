
import firebase from 'react-native-firebase';
import { AsyncStorage } from 'react-native';
import {
  ADDRESSES_SET,
  ADDRESS_INDEX_SET,
  FIRST_LAUNCH_STATUS_SET
} from './types';

// save multiple addresses locally?
// two functions: create New Address, deletd address, selectaddress, edit address
// when we send the order? cloud FX can save addresses by address ID under the customer subcollection
// --> the customer never has to interact with them; its for US

// if when we load addresses, we have none -> launch tutorial!

export const createNewAddress = (address, all_addresses) => {
  return (dispatch) => {
    const addresses = [ address, ...all_addresses ];
    let address_index = addresses.length - 1;

    AsyncStorage.setItem('ALL_ADDRESSES', JSON.stringify(addresses), () => {
      console.log('set addresses in async storage', addresses)
    });
    AsyncStorage.setItem('ADDRESS_INDEX', address_index, () => {
      console.log('set address index in async storage', address_index)
    });

    dispatch({ type: ADDRESSES_SET, payload: { addresses } });
    dispatch({ type: ADDRESS_INDEX_SET, payload: { address_index } });

    Actions.popTo('homepage');
    // if logged in, save addresses to account??
  };
};

export const setAddressIndex = (address_index) => {
  return (dispatch) => {
    AsyncStorage.setItem('ADDRESS_INDEX', address_index, () => {
      console.log('set address index in async storage', address_index)
    });
    dispatch({ type: ADDRESS_INDEX_SET, payload: { address_index } });
  };
};

export const deleteAddress = (address_index, all_addresses) => {
  return (dispatch) => {
    if (all_addresses.length <= 1) { return; } // can't remove if only one

    const addresses = [ ...all_addresses ];
    addresses.splice(address_index, 1);
    AsyncStorage.setItem('ALL_ADDRESSES', JSON.stringify(addresses), () => {
      console.log('set addresses in async storage', addresses)
    });

    // decrement the address index if the last item was deleted
    if (address_index >= addresses.length) {
      let new_addresss_index = address_index - 1;
      AsyncStorage.setItem('ADDRESS_INDEX', new_addresss_index, () => {
        console.log('set address index in async storage', new_addresss_index)
      });
      dispatch({ type: ADDRESS_INDEX_SET, payload: { address_index: new_addresss_index } });
    }
  };
};

export const loadAddresses = () => {
  return (dispatch) => {
    AsyncStorage.getItem('ALL_ADDRESSES', (err, addresses_t) => {
      if (addresses_t) {
        const addresses = JSON.parse(addresses_t);
        dispatch({ type: ADDRESSES_SET, payload: { addresses } });

        dispatch({ type: FIRST_LAUNCH_STATUS_SET, payload: { is_first_launch: false } });
      } else {
        dispatch({ type: FIRST_LAUNCH_STATUS_SET, payload: { is_first_launch: true } });
      }
    });
    AsyncStorage.getItem('ADDRESS_INDEX', (err, address_index) => {
      if (address_index >= 0) {
        dispatch({ type: ADDRESS_INDEX_SET, payload: { address_index } });
      }
    });
  };
};
