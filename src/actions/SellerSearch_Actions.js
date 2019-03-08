
import algoliasearch from 'algoliasearch/reactnative';
const algoliaClient = algoliasearch('BN0VV4WPRI', 'a85a04afca53d5baf47c659ce03d897f');
const algoliaSellers = algoliaClient.initIndex('sellers');
import moment from 'moment-timezone';

import firebase from 'react-native-firebase';

import {
  SELLERS_FETCH_BEGIN,
  SELLERS_FETCH_END,
  SELLERS_FETCH_ERROR,

  SELLERS_FETCH_BESTSTORE_END,
  SELLERS_FETCH_BESTPRICES_END,
} from './types';


export const fetchNearbySellers = (address) => {
  return (dispatch) => {
    dispatch({ type: SELLERS_FETCH_BEGIN });

    setTimeout(() => {
      dispatch({ type: SELLERS_FETCH_BESTSTORE_END });
    }, 2400);

    setTimeout(() => {
      dispatch({ type: SELLERS_FETCH_BESTPRICES_END });
    }, 4500);

    // fetch the location pin's REGION if none exists
    // then get all nearby stores for the region
    const fetchSellersForCoordinate = firebase.functions().httpsCallable('fetchSellersForCoordinate');
    fetchSellersForCoordinate(address.location).then((result) => {

      let { area, sellers } = result.data;


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
      dispatch({ type: SELLERS_FETCH_END, payload: { area, sellers } });
    }).catch((error) => {
      dispatch({ type: SELLERS_FETCH_ERROR });
    });
  };
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
