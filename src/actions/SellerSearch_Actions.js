
import algoliasearch from 'algoliasearch/reactnative';
const algoliaClient = algoliasearch('BN0VV4WPRI', 'a85a04afca53d5baf47c659ce03d897f');
const algoliaSellers = algoliaClient.initIndex('sellers');

import firebase from 'react-native-firebase';

import {
  SELLERS_FETCH_BEGIN,
  SELLERS_FETCH_END,
  SELLERS_FETCH_ERROR
} from './types';


export const fetchNearbySellers = (address) => {
  return (dispatch) => {
    dispatch({ type: SELLERS_FETCH_BEGIN });
    // fetch the location pin's REGION if none exists
    // then get all nearby stores for the region
    const fetchSellersForCoordinate = firebase.functions().httpsCallable('fetchSellersForCoordinate');
    fetchSellersForCoordinate(address.location).then((result) => {
      const { area, sellers } = result.data;
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
