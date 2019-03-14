// handles everything to do with store
import {
  SELLER_SELECT,

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


  // Section 2 of Store Home
  featured: [],
  featured_loading: true,
  categories: [], // contains an array OF categories (query, name, page, item array)
  categories_loading: true,
  requestFailed: false
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case SELLER_SELECT:
      return { ...INITIAL_STATE, ...p.seller };
    case SELLER_FEATURED_FETCH_END:
      return { ...state, featured: p.featured, featured_loading: false };
    case SELLER_CATEGORIES_FETCH_END:
      return { ...state, categories: p.categories, categories_loading: false, requestFailed: p.requestFailed};
    default:
      return state;
  }
};
