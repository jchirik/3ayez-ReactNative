
import firebase from 'react-native-firebase';
import algoliasearch from 'algoliasearch/reactnative';
const algoliaClient = algoliasearch('BN0VV4WPRI', 'a85a04afca53d5baf47c659ce03d897f');
import { Actions } from 'react-native-router-flux';
import { cleanAlgoliaItems } from '../Helpers';
import { NetInfo } from 'react-native'
import {
  SELLER_SELECT,
  BASKET_INIT,

  SELLER_FEATURED_FETCH_END,
  SELLER_CATEGORIES_FETCH_END
} from './types';
import {sceneKeys, navigateTo, navigateBackTo} from '../router';
//
// const fetchRecents = (seller_id, page, dispatch) => {
// //   const { currentUser } = firebase.auth();
// //   if (currentUser) {
// //     const customerID = currentUser.uid;
// //
// //     algoliaIndex.getObjects(recentUPCs, (err, content) => {
// //       if (err) throw err;
// //       let results = content.results.filter(result => result !== null).map(result => result.thumbnail_url)
// //       results = results.splice(0, 4);
// //       console.log('got recent back', results);
// //       dispatch({
// //         type: CHECK_IF_RECENT_SET,
// //         payload: {
// //           recentUPCImages: results
// //         }
// //       });
// //     });
// //   }
// };

const fetchFeaturedItems = (seller_id, featuredT, dispatch) => {

    // iterate over subcategories & search all in their facets (ONLY icons? use cloudinary for this?)
    const queries = [];
    featuredT.forEach((row) => {

      if (row.type === 'promotions') {
        queries.push({
          indexName: seller_id,
          params: {
            filters: 'promotion_price > 0',
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
            hitsPerPage: 1000
          }
        });
      } else {
        queries.push({
          indexName: seller_id,
          params: {
            facetFilters: [`${row.type}:${row.filter}`],
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
            hitsPerPage: 1000
          }
        });
      }
    });

    const searchRequestTime = Date.now();

    algoliaClient.search(queries, (err, content) => {
      if (err) {
        // console.log('err');
        return;
      }
      const featured = [];
      featuredT.forEach((row, index) => {
        const allItems = content.results[index].hits;
        featured.push({
          name: row.name,
          items: cleanAlgoliaItems(allItems)
        });
      });
      console.log('fetchStoreData FEATURED', featured);
      dispatch({ type: SELLER_FEATURED_FETCH_END, payload: { featured } });
  });
}



const fetchStoreData = (seller_id, dispatch) => {
  NetInfo.isConnected.fetch().done((isConnected) => {
    if (!isConnected) {
      dispatch({ type: SELLER_CATEGORIES_FETCH_END, payload: { requestFailed: true } });
    } else {
      const sellerRef = firebase.firestore().collection('sellers').doc(seller_id);
      sellerRef.collection('data').doc('app').get().then((document) => {
        if (document.data()) {
          const categories = document.data().categories || [];
          const featured = document.data().featured || [];
          dispatch({ type: SELLER_CATEGORIES_FETCH_END, payload: { categories, requestFailed: false } });
          fetchFeaturedItems(seller_id, featured, dispatch);
        } else { 
          dispatch({ type: SELLER_CATEGORIES_FETCH_END, payload: { requestFailed: true } });
        }
      }).catch((error) => {
        dispatch({ type: SELLER_CATEGORIES_FETCH_END, payload: { requestFailed: true } });
      });
    }
  });
};

export const selectSeller = (seller) => {
  return (dispatch) => {
    dispatch({ type: SELLER_SELECT, payload: { seller } });
    dispatch({ type: BASKET_INIT, payload: { seller_id: seller.id } });
    navigateBackTo(sceneKeys.root); // navigate to store page
    fetchStoreData(seller.id, dispatch) /* fetch featured & categories */

    // AFTER getting featured, get the data to fill each
  };
};

export const fetchStore = (seller_id) => {
  return (dispatch) => {
    fetchStoreData(seller_id, dispatch);
  };
};
