/*
CustomerData_Actions.js
*/

import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';

import algoliasearch from 'algoliasearch/reactnative';
import { cleanAlgoliaItems } from '../Helpers';

import {
  REVIEW_ITEMS_DATA_BEGIN,
  REVIEW_ITEMS_DATA_SET,
  REVIEW_SUBSTITUTION_SET,


  SUBSTITUTION_OPTIONS_BEGIN,
  SUBSTITUTION_OPTIONS_SET
} from './types';

const algoliaClient = algoliasearch('BN0VV4WPRI', 'a85a04afca53d5baf47c659ce03d897f');



export const submitOrderChanges = (order_id, review_items, substitutions, onComplete) => {
  return (dispatch) => {
    console.log(order_id, review_items, substitutions);

    const batch = firebase.firestore().batch();
    const orderRef = firebase.firestore().collection('orders').doc(order_id);

    batch.update(orderRef, { requires_review: false });

    substitutions.filter(item => item).forEach(item => {
      const itemRef = firebase.firestore().collection("orders").doc(order_id).collection("items").doc(item.upc);
      batch.set(itemRef, item);
    })

    review_items.forEach(item => {
      const itemRef = firebase.firestore().collection("orders").doc(order_id).collection("items").doc(item.upc);
      batch.update(itemRef, { in_review: false, original_quantity: item.quantity });
    })

    batch.commit().then((docRef) => {
        onComplete();
      })
  }
}


export const fetchReviewOrderItems = (order_id) => {
  return (dispatch) => {
    if (order_id) {

      dispatch({ type: REVIEW_ITEMS_DATA_BEGIN });
      // realtime listening of the order items
      const itemsListener = firebase.firestore().collection('orders').doc(order_id).collection('items')
        .get().then((documents) => {
          const items = documents.docs.map(item => {
            const id = item.id;
            const data = item.data();
            return ({ ...data, id });
          });
          const review_items = items.filter(item => item.in_review);
          dispatch({ type: REVIEW_ITEMS_DATA_SET, payload: { items, review_items } });
      });

    }
  };
};

export const setReviewItemSubstitution = (index, item) => {
  return (dispatch) => {
    dispatch({ type: REVIEW_SUBSTITUTION_SET, payload: { index, item } });
  };
};





// for swapping substitutions
export const fetchSubstitutionOptions = (sellerID, item, order_items) => {

  return (dispatch) => {

    dispatch({ type: SUBSTITUTION_OPTIONS_BEGIN });

    const algoliaIndex = algoliaClient.initIndex(sellerID);

    if (!item.categories || !item.categories.lvl1 || !item.categories.lvl1.length) {
      dispatch({ type: SUBSTITUTION_OPTIONS_SET, payload: { substitution_items: [] } });
      return;
    }

    const subcategory = item.categories.lvl1[0];

    algoliaIndex.search({
      facetFilters: [`categories.lvl1:${subcategory}`],
      filters: 'online',
      attributesToRetrieve: [
        'title_arab',
        'title_engl',
        'price',
        'promotion_price',
        'thumbnail_url',
        'categories',
        'image_url',
        'unit',
        'brand',
        'incr',
        'upc'
      ],
      hitsPerPage: 30
    }).then(res => {
      // console.log(page >= res.nbPages);
      // console.log(`${page} of ${res.nbPages}`);
      const substitution_items = cleanAlgoliaItems(res.hits).filter((item) => {
        // filter out items that exist in our order already, so no conflicts
        const itemExists = order_items.find(order_item => (order_item.upc === item.upc));
        if (itemExists) { return false; }
        return true;
      })
      dispatch({ type: SUBSTITUTION_OPTIONS_SET, payload: { substitution_items } });
    }).catch(() => {
      dispatch({ type: SUBSTITUTION_OPTIONS_SET, payload: { substitution_items: [] } });
    })
  };
};
