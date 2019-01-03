import {
  CATEGORY_DATA_BEGIN,
  CATEGORY_DATA_SET,

  SUBCATEGORY_SET,

  ITEM_SEARCH_QUERY_SET,
  ITEM_SEARCH_DATA_SET,
  ITEM_SEARCH_DATA_RESET,

  SET_CUSTOM_ITEM_MODAL,
  HIDE_CUSTOM_ITEM_MODAL
} from '../actions/types';

const INITIAL_STATE = {

  category: null,
  subcategory: null,
  subcategoryColumnIndex: 0,
  catagoryData: [],
  isLoadingCategoryData: false,

  results: [],
  searchQuery: '',
  isLoadingSearchData: false,

  customItemModalVisible: false,
  customItemModalText: ''
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case CATEGORY_DATA_BEGIN:
      return { ...state, categoryData: [], category: p.category, isLoadingCategoryData: true };
    case CATEGORY_DATA_SET:
      return { ...state, categoryData: p.categoryData, isLoadingCategoryData: false }
    case SUBCATEGORY_SET:
      return { ...state, subcategory: p.subcategory, subcategoryColumnIndex: p.columnIndex }
    case ITEM_SEARCH_QUERY_SET:
      return { ...state, results: [], isLoadingSearchData: true, searchQuery: p.searchQuery };
    case ITEM_SEARCH_DATA_SET:
      return { ...state, results: p.results, isLoadingSearchData: false };
    case ITEM_SEARCH_DATA_RESET:
      return {
        ...state,
        results: [],
        searchQuery: '',
        isLoadingSearchData: false
      };
    case SET_CUSTOM_ITEM_MODAL:
      return { ...state, customItemModalVisible: true, customItemModalText: action.payload };
    case HIDE_CUSTOM_ITEM_MODAL:
      return { ...state, customItemModalVisible: false, customItemModalText: '' };
    default:
      return state;
  }
};
