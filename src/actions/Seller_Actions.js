
import firebase from 'react-native-firebase';
import algoliasearch from 'algoliasearch/reactnative';
const algoliaClient = algoliasearch('BN0VV4WPRI', 'a85a04afca53d5baf47c659ce03d897f');
import { Actions } from 'react-native-router-flux';
import { cleanAlgoliaItems } from '../Helpers';
import { NetInfo } from 'react-native'
import { AppEventsLogger } from 'react-native-fbsdk';
import appsFlyer from 'react-native-appsflyer';
import {
  SELLER_SELECT,
  BASKET_INIT,

  SELLER_FEATURED_FETCH_END,
  SELLER_CATEGORIES_FETCH_END
} from './types';
import {sceneKeys, navigateTo, navigateBackTo} from '../router';

const fetchFeaturedItems = (seller_id, featuredT, dispatch) => {

    const promises = [];

    // 1. RECENT ITEMS
    const { currentUser } = firebase.auth();
    if (currentUser) {
      const customer_id = currentUser.uid;
      const fetchRecentItemsFx = firebase.functions().httpsCallable('fetchRecentItems');
      promises.push(fetchRecentItemsFx({ seller_id, customer_id }));
    }

    // 2. CUSTOM FEATURED
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
              'description',
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
              'description',
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
    promises.push(new Promise((resolve, reject) => {
      algoliaClient.search(queries, (err, content) => resolve(content))
    }));

    // fetch promise Data
    Promise.all(promises).then(featuredData => {
      const recentItemsResults = featuredData[0].data.results;
      const customFeaturedResults = featuredData[1].results;

      const featured = [];
      if (recentItemsResults && recentItemsResults.length) {
        featured.push({
          name: { ar: 'آخر الأصناف', en: 'Recent Items' },
          items: cleanAlgoliaItems(recentItemsResults)
        });
      }

      featuredT.forEach((row, index) => {
        const allItems = customFeaturedResults[index].hits;
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
          let categories = document.data().categories || [];
          const featured = document.data().featured || [];

          categories = categories.filter(category => !(category.is_online === false))
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

    firebase.analytics().logEvent("ENTERED_STORE", { seller_id: seller.id });
    firebase.analytics().setUserProperty("last_seller", seller.id);
    AppEventsLogger.logEvent('ENTERED_STORE');
    appsFlyer.trackEvent('ENTERED_STORE', { seller_id: seller.id })

  };
};

export const fetchStore = (seller_id) => {
  return (dispatch) => {
    fetchStoreData(seller_id, dispatch);
  };
};
