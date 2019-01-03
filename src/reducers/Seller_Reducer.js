// handles everything to do with store
import {
  SELLER_SELECT,

  SELLER_PROMOTIONS_FETCH_END,
  SELLER_RECENTS_FETCH_END,
  SELLER_FEATURED_FETCH_END,
  SELLER_CATEGORIES_FETCH_END
} from '../actions/types';


const INITIAL_STATE = {
  // ... from the seller doc
  id: null, // we know how to get this (via create acccount or login account)
  logo_url: '',
  display_name: {},
  minimum: 100,
  phone: '',

  delivery_fee: 3,

  // Section 1 of Store Home
  promotions: [],
  promotions_page: -1,
  promotions_loading: true,

  recents: [],

  // Section 2 of Store Home
  featured: [],
  categories: [], // contains an array OF categories (query, name, page, item array)
  categories_loading: true
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case SELLER_SELECT:
      return { ...INITIAL_STATE, ...p.seller };
    case SELLER_PROMOTIONS_FETCH_END:
      if (p.promotions_page > state.promotions_page) {
        return {
          ...state,
          promotions: [ ...state.promotions, ...p.promotions ], // append results
          promotions_page: p.promotions_page,
          promotions_loading: false
        };
      }
    case SELLER_FEATURED_FETCH_END:
      return { ...state, featured: p.featured };
    case SELLER_CATEGORIES_FETCH_END:
      return { ...state, categories: p.categories, categories_loading: false };
    default:
      return state;
  }
};
