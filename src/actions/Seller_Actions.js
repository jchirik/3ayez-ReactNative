
import firebase from 'react-native-firebase';
import algoliasearch from 'algoliasearch/reactnative';
const algoliaClient = algoliasearch('BN0VV4WPRI', 'a85a04afca53d5baf47c659ce03d897f');
import { Actions } from 'react-native-router-flux';

import {
  SELLER_SELECT,
  BASKET_INIT,

  SELLER_PROMOTIONS_FETCH_END,
  SELLER_RECENTS_FETCH_END,
  SELLER_FEATURED_FETCH_END,
  SELLER_CATEGORIES_FETCH_END
} from './types';

const fetchPromotions = (seller_id, page, dispatch) => {
  const algoliaIndex = algoliaClient.initIndex(seller_id);
  algoliaIndex.search({
    filters: 'promotion_price > 0',
    hitsPerPage: 6
  }).then(res => {
    console.log('fetchPromotions', res.hits);
    dispatch({ type: SELLER_PROMOTIONS_FETCH_END, payload: { promotions: res.hits, promotions_page: page } });
  }).catch(e => console.log('error', e));
};

const fetchRecents = (seller_id, page, dispatch) => {
//   const { currentUser } = firebase.auth();
//   if (currentUser) {
//     const customerID = currentUser.uid;
//
//     algoliaIndex.getObjects(recentUPCs, (err, content) => {
//       if (err) throw err;
//       let results = content.results.filter(result => result !== null).map(result => result.thumbnail_url)
//       results = results.splice(0, 4);
//       console.log('got recent back', results);
//       dispatch({
//         type: CHECK_IF_RECENT_SET,
//         payload: {
//           recentUPCImages: results
//         }
//       });
//     });
//   }
};

const fetchStoreData = (seller_id, dispatch) => {
  const sellerRef = firebase.firestore().collection('sellers').doc(seller_id)
  sellerRef.collection('data').doc('app').get().then((document) => {
    const featured = document.data() ? document.data().featured : [];
    const categories = document.data() ? document.data().categories : [];
    console.log('fetchStoreData FEATURED', featured);
    console.log('fetchStoreData CATEGORIES', categories);
    dispatch({ type: SELLER_FEATURED_FETCH_END, payload: { featured } });
    dispatch({ type: SELLER_CATEGORIES_FETCH_END, payload: { categories } });
  });
};

export const selectSeller = (seller) => {
  return (dispatch) => {
    dispatch({ type: SELLER_SELECT, payload: { seller } });
    dispatch({ type: BASKET_INIT, payload: { seller_id: seller.id } });
    Actions.storePage(); // navigate to store page
    fetchStoreData(seller.id, dispatch) /* fetch featured & categories */
    fetchPromotions(seller.id, 0, dispatch) /* fetch discounts */
    fetchRecents(seller.id, 0, dispatch) /* fetch recents */
  };
};


export const initSellerBLINK22 = (seller) => {
  return (dispatch) => {
    dispatch({ type: SELLER_SELECT, payload: { seller } });
    dispatch({ type: BASKET_INIT, payload: { seller_id: seller.id } });
    // Actions.storePage(); // navigate to store page
    fetchStoreData(seller.id, dispatch) /* fetch featured & categories */
    fetchPromotions(seller.id, 0, dispatch) /* fetch discounts */
  };
};
