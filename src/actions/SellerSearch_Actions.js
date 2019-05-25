
import algoliasearch from 'algoliasearch/reactnative';
const algoliaClient = algoliasearch('BN0VV4WPRI', 'a85a04afca53d5baf47c659ce03d897f');
const algoliaSellers = algoliaClient.initIndex('sellers');
import moment from 'moment-timezone';

import firebase from 'react-native-firebase';

import {
  SELLERS_FETCH_BEGIN,
  SELLERS_FETCH_END,
  SELLERS_FETCH_ERROR
} from './types';



export const fetchNearbySellers = (area, dispatch) => {
    const ogTime = Date.now();
    dispatch({ type: SELLERS_FETCH_BEGIN });

    // fetch the location pin's REGION if none exists
    // then get all nearby stores for the region
    const fetchSellersForArea = firebase.functions().httpsCallable('fetchSellersForArea');
    fetchSellersForArea({ area_id: area.id }).then((result) => {

      let { sellers } = result.data;
      console.log('fetchSellersForArea', sellers)

      sellers = sellers.map(seller => {
        // get the open hour, for today in Cairo
        const midnightLocaleTime = moment(Date.now()).tz('Africa/Cairo');
        midnightLocaleTime.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).valueOf();
        const todays_hours = {
          start: seller.hours.start + midnightLocaleTime,
          end: seller.hours.end + midnightLocaleTime
        }

        // ensure all sellers have a type, default to EXPRESS
        return {
          ...seller,
          type: seller.type || 'EXPRESS',
          todays_hours
        }
      });
      console.log(sellers)
      dispatch({ type: SELLERS_FETCH_END, payload: { sellers } });

      // let additionalTimeout = 0;
      // if (sellers.length === 1) {
      //   additionalTimeout = Math.max((2400 - (Date.now() - ogTime)), 0);
      // }
      // setTimeout(() => {
      //
      // }, additionalTimeout);

    }).catch((error) => {
      console.log('Error fetching sellers', error)
      dispatch({ type: SELLERS_FETCH_ERROR });
    });
};


//   algoliaSellers.search({
//     filters: `delivery_regions:${area.id} AND online`, // must be online, and in your region
//     hitsPerPage: 200,
//     // aroundLatLng: `${point.lat}, ${point.lng}`, // use this to return distance
//     // getRankingInfo: true,
//     // aroundRadius: 25000
//   }).then(res => {
//     const sellers = res.hits.map(seller => ({ ...seller, id: seller.objectID }));
//
//   }).catch(() => {
//     dispatch({ type: SELLERS_FETCH_ERROR });
//   })
// } else {
//   dispatch({ type: SELLERS_FETCH_END, payload: { sellers: [] } });
