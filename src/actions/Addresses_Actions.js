
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import { AsyncStorage } from 'react-native';
import {
  ADDRESS_SUBMIT_BEGIN,
  ADDRESS_SUBMIT_SUCCESS,
  ADDRESS_SUBMIT_FAILURE
} from './types';




// save multiple addresses locally?
// two functions: create New Address, deletd address, selectaddress, edit address
// when we send the order? cloud FX can save addresses by address ID under the customer subcollection
// --> the customer never has to interact with them; its for US

// if when we load addresses, we have none -> launch tutorial!

export const createNewAddress = (address) => {
  return (dispatch) => {
    // const batch = firebase.firestore().batch();
    const { currentUser } = firebase.auth();

    dispatch({ type: ADDRESS_SUBMIT_BEGIN });
    // post the address to firestore
    const addressRef = firebase.firestore().collection('customers').doc(currentUser.uid).collection('addresses').doc();
    addressRef.set({ ...address, timestamp: Date.now() }).then(() => {
      console.log('createNewAddress success');
      dispatch({ type: ADDRESS_SUBMIT_SUCCESS });
      Actions.popTo('homepage');
    }).catch(() => {
      dispatch({ type: ADDRESS_SUBMIT_FAILURE });
    })
    //
    // batch.update(addressRef, );
    //
    // // // save selected_address_id to user's firestore
    // // const customerRef = firebase.firestore().collection('customers').doc(currentUser.uid);
    // // batch.update(customerRef, { selected_address_id: addressRef.id });
    //
    // batch.commit().then(() => {
    //   console.log('created user in database');
    // })
  };
};



export const deleteAddress = (address_id) => {
  return (dispatch) => {
    console.log('deleteAddress', address_id);
    const { currentUser } = firebase.auth();
    const addressRef = firebase.firestore().collection('customers').doc(currentUser.uid)
      .collection('addresses').doc(address_id);
    addressRef.delete().then(() => {
      console.log('deleteAddress successful', address_id, currentUser.uid);
    })
  }
}


// export const setAddressIndex = (address_index) => {
//   return (dispatch) => {
//     AsyncStorage.setItem('ADDRESS_INDEX', JSON.stringify(address_index), () => {
//       console.log('set address index in async storage', address_index)
//     });
//     dispatch({ type: ADDRESS_INDEX_SET, payload: { address_index } });
//   };
// };

// export const deleteAddress = (address_index, all_addresses) => {
//   return (dispatch) => {
//     if (all_addresses.length <= 1) { return; } // can't remove if only one
//
//     const addresses = [ ...all_addresses ];
//     addresses.splice(address_index, 1);
//     AsyncStorage.setItem('ALL_ADDRESSES', JSON.stringify(addresses), () => {
//       console.log('set addresses in async storage', addresses)
//     });
//
//     // decrement the address index if the last item was deleted
//     if (address_index >= addresses.length) {
//       let new_addresss_index = address_index - 1;
//       AsyncStorage.setItem('ADDRESS_INDEX', JSON.stringify(new_addresss_index), () => {
//         console.log('set address index in async storage', new_addresss_index)
//       });
//       dispatch({ type: ADDRESS_INDEX_SET, payload: { address_index: new_addresss_index } });
//     }
//   };
// };

// export const loadAddresses = () => {
//   return (dispatch) => {
//     AsyncStorage.getItem('ALL_ADDRESSES', (err, addresses_t) => {
//       if (addresses_t) {
//         const addresses = JSON.parse(addresses_t);
//         console.log('loadAddresses addresses', addresses);
//         dispatch({ type: ADDRESSES_SET, payload: { addresses } });
//       } else {
//         Actions.tutorial();
//       }
//     });
//     AsyncStorage.getItem('ADDRESS_INDEX', (err, address_index_t) => {
//       const address_index = JSON.parse(address_index_t);
//       if ((address_index !== null) && (address_index >= 0)) {
//         console.log('loadAddresses address_index', address_index);
//         dispatch({ type: ADDRESS_INDEX_SET, payload: { address_index } });
//       }
//     });
//   };
// };
