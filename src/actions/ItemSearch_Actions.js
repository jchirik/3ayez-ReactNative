/*
ItemSearch_Actions.js
*/

import algoliasearch from 'algoliasearch/reactnative';
import firebase from 'react-native-firebase';
import _ from 'lodash';
import { cleanAlgoliaItems, groupAlgoliaItems } from '../Helpers';
import { strings } from '../i18n';
import { Actions } from 'react-native-router-flux';

import { Image } from 'react-native';

import {
  ITEM_SEARCH_QUERY_SET,
  ITEM_SEARCH_DATA_SET,
  ITEM_SEARCH_DATA_RESET,
  CATEGORY_DATA_BEGIN,
  CATEGORY_DATA_SET,
  SUBCATEGORY_SET,
  SET_CUSTOM_ITEM_MODAL,
  HIDE_CUSTOM_ITEM_MODAL,
  SEARCH_SUBCATEGORY_DATA_BEGIN,
  SEARCH_SUBCATEGORY_DATA_END,
  ITEM_BARCODE_SEARCH_BEGIN,
  ITEM_BARCODE_SEARCH_SUCCESS,
  ITEM_BARCODE_SEARCH_ERROR,
  ITEM_BARCODE_SEARCH_RESET
} from './types';
import { sceneKeys, navigateTo } from '../router';

const algoliaClient = algoliasearch(
  'BN0VV4WPRI',
  'a85a04afca53d5baf47c659ce03d897f'
);

export const selectSubcategory = (subcategory, columnIndex) => {
  return dispatch => {
    dispatch({ type: SUBCATEGORY_SET, payload: { subcategory, columnIndex } });
  };
};

export const resetBarcodeSearch = () => {
  return dispatch => {
    dispatch({ type: ITEM_BARCODE_SEARCH_RESET });
  };
};

export const onSelectSearchBarcode = (seller_id, barcode) => {
  return dispatch => {
    dispatch({ type: ITEM_BARCODE_SEARCH_BEGIN });
    const algoliaIndex = algoliaClient.initIndex(seller_id);
    algoliaIndex
      .search({
        filters: 'objectID:' + barcode,
        exactOnSingleWordQuery: 'attribute'
      })
      .then(res => {
        const { hits: items } = res;
        dispatch({ type: ITEM_BARCODE_SEARCH_SUCCESS, payload: items });
      })
      .catch(err => {
        dispatch({ type: ITEM_BARCODE_SEARCH_ERROR });
      });
  };
};

// setItemSearchQuery
// fetchQueryResults

// fetch ALL items/images for its subcategories here (only upc, title_arab, price, image_url)
// paginate subcategory loading?
export const onSelectSearchSubcategory = (seller_id, subcategory) => {
  return dispatch => {
    dispatch({ type: SEARCH_SUBCATEGORY_DATA_BEGIN });

    const algoliaIndex = algoliaClient.initIndex(seller_id);
    algoliaIndex
      .search({
        facetFilters: [`categories.lvl1:${subcategory.filter}`],
        filters: 'online',
        attributesToRetrieve: [
          'title_arab',
          'title_engl',
          'description',
          'price',
          'promotion_price',
          'out_of_stock',
          'thumbnail_url',
          'categories',
          'image_url',
          'unit',
          'brand',
          'incr',
          'upc'
        ],
        hitsPerPage: 1000
      })
      .then(res => {
        // console.log(page >= res.nbPages);
        // console.log(`${page} of ${res.nbPages}`);
        const itemResults = cleanAlgoliaItems(res.hits);
        console.log('itemResults', itemResults);
        navigateTo(sceneKeys.storeShelf, {
          title: subcategory.name,
          parent_title: strings('Common.search'),
          items: itemResults,
          jumpIndex: 0
        });
        dispatch({ type: SEARCH_SUBCATEGORY_DATA_END });
      })
      .catch(error => {
        dispatch({ type: SEARCH_SUBCATEGORY_DATA_END });
      });
  };
};

// fetch ALL items/images for its subcategories here (only upc, title_arab, price, image_url)
// paginate subcategory loading?
export const onSelectCategory = (sellerID, category) => {
  return dispatch => {
    dispatch({ type: CATEGORY_DATA_BEGIN, payload: { category } });

    if (!category.sub || category.sub === []) return;

    // iterate over subcategories & search all in their facets (ONLY icons? use cloudinary for this?)
    const queries = [];
    category.sub.forEach(subcategory => {
      // console.log(subcategory)
      queries.push({
        indexName: sellerID,
        params: {
          facetFilters: [`${subcategory.type}:${subcategory.filter}`],
          filters: 'online',
          attributesToRetrieve: [
            'title_arab',
            'title_engl',
            'description',
            'price',
            'promotion_price',
            'out_of_stock',
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
        const items = cleanAlgoliaItems(allItems);
        const groupedItems = groupAlgoliaItems(items, subcategory.sub);
        const groups = _.groupBy(items, item => {
          if (item.categories.lvl2) {
            return item.categories.lvl2;
          } else {
            return item.categories.lvl1;
          }
        });
        categoryData.push({
          name: subcategory.name,
          items,
          groupedItems,
          groups
        });
        //
        // allItems.forEach((item) => {
        //   Image.prefetch(item.thumbnail_url);
        // });
      });
      dispatch({
        type: CATEGORY_DATA_SET,
        payload: { categoryData, searchRequestTime }
      });
    });
  };
};

export const setItemSearchQuery = ({ query }) => {
  return dispatch => {
    console.log('query', query);
    dispatch({ type: ITEM_SEARCH_QUERY_SET, payload: { query } });
  };
};

export const fetchQueryResults = ({ seller, query }) => {
  return dispatch => {
    console.log('query', query);
    // dispatch({ type: ITEM_SEARCH_QUERY_SET, payload: { query } });
    const algoliaIndex = algoliaClient.initIndex(seller.id);

    // return;
    // for decent performance, debounce the following part

    const trimmedQuery = query.trim() ? query : '';
    if (trimmedQuery === '') {
      dispatch({
        type: ITEM_SEARCH_DATA_SET,
        payload: {
          query,
          subcategoryResults: [],
          categoryResults: [],
          itemResults: []
        }
      });
    } else {
      // replace this logic later with one from Algolia (including brands)

      const categoryResults = [];
      const subcategoryResults = [];

      if (trimmedQuery.length > 2) {
        // do a local string search over categories (display names)
        seller.categories.map(category => {
          if (!category.name) {
            return;
          }
          const ar_match = category.name.ar
            .toUpperCase()
            .includes(trimmedQuery.toUpperCase());
          const en_match = category.name.en
            .toUpperCase()
            .includes(trimmedQuery.toUpperCase());
          if (ar_match || en_match) {
            // TO DO: give higher priority to matches with the begining of words, or Algolia
            categoryResults.push(category);
          }
        });
        // do a local string search over subcategories (display names)
        seller.categories.forEach(category => {
          if (!category.name) {
            return;
          }
          category.sub.map(subcategory => {
            if (!subcategory.name) {
              return;
            }
            const ar_match = subcategory.name.ar
              .toUpperCase()
              .includes(trimmedQuery.toUpperCase());
            const en_match = subcategory.name.en
              .toUpperCase()
              .includes(trimmedQuery.toUpperCase());
            if (ar_match || en_match) {
              subcategoryResults.push({
                ...subcategory,
                parent_name: category.name
              });
            }
          });
        });
      }

      // search items
      algoliaIndex
        .search({
          query: trimmedQuery,
          filters: 'online',
          hitsPerPage: 15
        })
        .then(res => {
          // console.log(page >= res.nbPages);
          // console.log(`${page} of ${res.nbPages}`);
          const itemResults = cleanAlgoliaItems(res.hits);

          console.log(
            'ALL SEARCH',
            categoryResults,
            subcategoryResults,
            itemResults
          );
          dispatch({
            type: ITEM_SEARCH_DATA_SET,
            payload: {
              query,
              subcategoryResults,
              categoryResults,
              itemResults
            }
          });
        });
    }
  };
};

export const setCustomItemModal = text => {
  return dispatch => {
    dispatch({ type: SET_CUSTOM_ITEM_MODAL, payload: text });
  };
};

export const hideCustomItemModal = () => {
  return dispatch => {
    dispatch({ type: HIDE_CUSTOM_ITEM_MODAL });
  };
};

export const resetQueryItems = () => {
  return dispatch => {
    dispatch({ type: ITEM_SEARCH_DATA_RESET });
  };
};
