
import algoliasearch from 'algoliasearch/reactnative';
const algoliaClient = algoliasearch('BN0VV4WPRI', 'a85a04afca53d5baf47c659ce03d897f');
const algoliaSellers = algoliaClient.initIndex('sellers');

import {
  SELLERS_FETCH_BEGIN,
  SELLERS_FETCH_END,
} from './types';

export const fetchNearbySellers = (point, area_id) => {
  return (dispatch) => {
    dispatch({ type: SELLERS_FETCH_BEGIN });

    const sellers = [{
      stars: 4.7,
      id: 'zahran_smouha'
    }];

    // algoliaSellers.search({
    //   filters: `delivery_regions:${area_id} AND online`, // must be online, and in your region
    //   aroundLatLng: `${point.lat}, ${point.lng}`, // use this to return distance
    //   getRankingInfo: true,
    //   aroundRadius: 25000,
    //   hitsPerPage: 200
    // }).then(res => {
    //   // why is THIS not sufficient??
    //   console.log('fetchNearbySellers res.hits', res.hits);
    //
    //   const sellers = [];
    //   res.hits.forEach(seller => sellers.push({ ...seller, id: seller.objectID }));
    //
    //   console.log('fetchNearbySellers', sellers);
    //   dispatch({ type: SELLERS_FETCH_END, payload: { sellers } });
    // });
    dispatch({ type: SELLERS_FETCH_END, payload: { sellers } });
  };
};
