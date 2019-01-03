/*
ItemSearch_Actions.js
*/

import algoliasearch from 'algoliasearch/reactnative';
import firebase from 'react-native-firebase';
import { strings } from '../Helpers.js';

import {
  Image
} from 'react-native';

import {
  ITEM_SEARCH_QUERY_SET,
  ITEM_SEARCH_DATA_SET,
  ITEM_SEARCH_DATA_RESET,

  SUBSTITUTION_OPTIONS_BEGIN,
  SUBSTITUTION_OPTIONS_SET,


  CATEGORY_DATA_BEGIN,
  CATEGORY_DATA_SET,

  SUBCATEGORY_SET,

  SET_CUSTOM_ITEM_MODAL,
  HIDE_CUSTOM_ITEM_MODAL
} from './types';


const algoliaClient = algoliasearch('BN0VV4WPRI', 'a85a04afca53d5baf47c659ce03d897f');


export const selectSubcategory = (subcategory, columnIndex) => {
  return (dispatch) => {
    dispatch({ type: SUBCATEGORY_SET, payload: { subcategory, columnIndex } });
  };
};


const cleanAlgoliaItems = (allItems) => {
  // ONLY use items that have images
  const safeItems = [];
  allItems.forEach((item) => {
    if (item.image_url && item.thumbnail_url) {
      const safeItem = item;
      safeItem.price = parseFloat(item.price) || null;
      safeItem.promotion_price = parseFloat(item.promotion_price) || null;
      safeItem.max_per_basket = parseFloat(item.max_per_basket) || null;
      // safeItem.increment = parseFloat(item.increment) || 1;
      safeItem.incr = parseFloat(item.incr) || 1;
      safeItem.unit = (item.unit ? item.unit : '');
      safeItems.push(safeItem);
    }
  });
  return safeItems;
};

// fetch ALL items/images for its subcategories here (only upc, title_arab, price, image_url)
// paginate subcategory loading?
export const onSelectCategory = (sellerID, category) => {

  return (dispatch) => {
    dispatch({ type: CATEGORY_DATA_BEGIN, payload: { category } });

    if (!category.sub || category.sub === []) return;

      // iterate over subcategories & search all in their facets (ONLY icons? use cloudinary for this?)
      const queries = [];
      category.sub.forEach((subcategory) => {
        // console.log(subcategory)
        queries.push({
          indexName: sellerID,
          params: {
            facetFilters: [`${subcategory.type}:${subcategory.filter}`],
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
            hitsPerPage: 100
          }
        });
      });

      const searchRequestTime = Date.now();

      algoliaClient.search(queries, (err, content) => {
        if (err) {
          // console.log('err');
          return;
        }
        const categoryData = [];
        category.sub.forEach((subcategory, index) => {
          const allItems = content.results[index].hits;
          categoryData.push({
            name: subcategory.name,
            items: cleanAlgoliaItems(allItems)
          });

          allItems.forEach((item) => {
            Image.prefetch(item.thumbnail_url);
          });
        });
        dispatch({ type: CATEGORY_DATA_SET, payload: { categoryData, searchRequestTime } });
    });
  };
};




export const fetchPromotionItems = (sellerID) => {

  return (dispatch) => {

    dispatch({ type: ITEM_SEARCH_QUERY_SET, payload: { searchQuery: strings('SpecialtyBlock.promotions') } });
    const algoliaIndex = algoliaClient.initIndex(sellerID);
    // console.log('Fetching promotion items', sellerID)

    algoliaIndex.search({
      filters: 'promotion_price > 0',
      hitsPerPage: 100
    }).then(res => {
      // console.log(page >= res.nbPages);
      // console.log(`${page} of ${res.nbPages}`);
    //  console.log('got promotons back', res.hits)
      dispatch({
        type: ITEM_SEARCH_DATA_SET,
        payload: {
          results: cleanAlgoliaItems(res.hits)
        }
      });
    }).catch(e => console.log('error', e));

  };
};




// for swapping substitutions
export const fetchSubstitutionOptions = (sellerID, itemsToSubstitute) => {

  return (dispatch) => {

    dispatch({ type: SUBSTITUTION_OPTIONS_BEGIN });

    const { currentUser } = firebase.auth();
    if (!currentUser) {
      dispatch({
        type: SUBSTITUTION_OPTIONS_SET,
        payload: {
          substitutionOptions: []
        }
      });
      return;
    }
    const customerID = currentUser.uid;

    const algoliaIndex = algoliaClient.initIndex(sellerID);
    // console.log('Fetching similar items', sellerID)

    const itemUPCs = itemsToSubstitute.map(item => item.upc);

    // console.log('1: upcs to substitute', itemUPCs)

    algoliaIndex.getObjects(itemUPCs, (err, content) => {
        if (err) throw err;
        let results = content.results;

    //    console.log('2: items fetched', results)
        // iterate over subcategories & search all in their facets (ONLY icons? use cloudinary for this?)
        const queries = [];
        results.forEach((item) => {
          const subcategory = item.categories.lvl1[0];

          // console.log('3: subcategory', subcategory)
          queries.push({
            indexName: sellerID,
            params: {
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
              hitsPerPage: 40
            }
          });
        });
        algoliaClient.search(queries, (err, content) => {
          if (err) {
          //  console.log('err');
            return;
          }

        //  console.log('4: subcategory', content.results)
          let substitutionOptions = [];
          results.forEach((og_item, index) => {

            const similarItemsForItem = cleanAlgoliaItems(content.results[index].hits);
            substitutionOptions = [ ...substitutionOptions, similarItemsForItem ]
          });

          // onsole.log('5', substitutionOptions)
          dispatch({ type: SUBSTITUTION_OPTIONS_SET, payload: { substitutionOptions } });
        });
    });
  };
};




export const fetchQueryResults = ({ sellerID, query }) => {
  return (dispatch) => {
    dispatch({ type: ITEM_SEARCH_QUERY_SET, payload: { searchQuery: query } });
    const algoliaIndex = algoliaClient.initIndex(sellerID);
    // console.log('Fetching for search query: ' + query)

    algoliaIndex.search({
      query,
      filters: 'online',
      hitsPerPage: 15
    }).then(res => {
      // console.log(page >= res.nbPages);
      // console.log(`${page} of ${res.nbPages}`);
      dispatch({
        type: ITEM_SEARCH_DATA_SET,
        payload: {
          results: cleanAlgoliaItems(res.hits)
        }
      });
    });
  };
};








export const setCustomItemModal = (text) => {
  return (dispatch) => {
    dispatch({ type: SET_CUSTOM_ITEM_MODAL, payload: text });
  };
};


export const hideCustomItemModal = () => {
  return (dispatch) => {
    dispatch({ type: HIDE_CUSTOM_ITEM_MODAL });
  };
};

export const resetQueryItems = () => {
  return (dispatch) => {
    dispatch({ type: ITEM_SEARCH_DATA_RESET });
  };
};
