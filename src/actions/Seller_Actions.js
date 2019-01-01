
import firebase from 'react-native-firebase';
import algoliasearch from 'algoliasearch/reactnative';
const algoliaClient = algoliasearch('BN0VV4WPRI', 'a85a04afca53d5baf47c659ce03d897f');
import { Actions } from 'react-native-router-flux';

import {
  SELLER_SELECT,
  BASKET_INIT,

  SELLER_PROMOTIONS_FETCH_END,
  SELLER_RECENTS_FETCH_END,
  SELLER_HOME_FETCH_END,
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
  // const { currentUser } = firebase.auth();
  // if (currentUser) {
  //   const customerID = currentUser.uid;
  //
  //   algoliaIndex.getObjects(recentUPCs, (err, content) => {
  //     if (err) throw err;
  //     let results = content.results.filter(result => result !== null).map(result => result.thumbnail_url)
  //     results = results.splice(0, 4);
  //     console.log('got recent back', results);
  //     dispatch({
  //       type: CHECK_IF_RECENT_SET,
  //       payload: {
  //         recentUPCImages: results
  //       }
  //     });
  //   });
  // }
};

const fetchHome = (seller_id, dispatch) => {
  // firebase.firestore().collection('sellers').doc(seller.id).collection('data').doc('featured')
  // .get().then((document) => {
  //   const featured = document.data() ? document.data().featured : [];
  //   console.log('fetched featured', featured);
  //
  //  dispatch({ type: CURRENT_SELLER_SELECT, payload: { featured } });
};

const fetchCategories = (seller_id, dispatch) => {
  const sellerRef = firebase.firestore().collection('sellers').doc(seller_id)
  sellerRef.collection('data').doc('featured').get().then((document) => {
    const categories = document.data() ? document.data().featured : [];
    console.log('fetchCategories', categories);
    dispatch({ type: SELLER_CATEGORIES_FETCH_END, payload: { categories } });
  });
};

export const selectSeller = (seller) => {
  return (dispatch) => {
    dispatch({ type: SELLER_SELECT, payload: { seller } });
    dispatch({ type: BASKET_INIT, payload: { seller_id: seller.id } });
    Actions.storePage(); // navigate to store page
    fetchPromotions(seller.id, 0, dispatch) /* fetch discounts */
    fetchRecents(seller.id, 0, dispatch) /* fetch recents */
    fetchHome(seller.id, dispatch) /* fetch home */
    fetchCategories(seller.id, dispatch) /* fetch categories */
  };
};
