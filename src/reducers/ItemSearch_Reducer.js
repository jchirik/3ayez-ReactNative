import {
  CATEGORY_DATA_BEGIN,
  CATEGORY_DATA_SET,
  SUBCATEGORY_SET,
  ITEM_SEARCH_QUERY_SET,
  ITEM_SEARCH_DATA_SET,
  ITEM_SEARCH_DATA_RESET,
  SET_CUSTOM_ITEM_MODAL,
  HIDE_CUSTOM_ITEM_MODAL,
  SEARCH_SUBCATEGORY_DATA_BEGIN,
  SEARCH_SUBCATEGORY_DATA_END,
  ITEM_BARCODE_SEARCH_BEGIN,
  ITEM_BARCODE_SEARCH_SUCCESS,
  ITEM_BARCODE_SEARCH_ERROR,
  ITEM_BARCODE_SEARCH_RESET
} from '../actions/types';

const INITIAL_STATE = {
  category: null,
  subcategory: null,
  subcategoryColumnIndex: 0,
  catagoryData: [],
  isLoadingCategoryData: false,

  isSearchingItemBarcode: false,
  barcodeSearchResult: { success: false, items: [] },

  subcategoryResults: [],
  subcategorySelectLoading: false,
  categoryResults: [],
  itemResults: [],
  query: '',
  isLoadingSearchData: false,

  customItemModalVisible: false,
  customItemModalText: ''
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case CATEGORY_DATA_BEGIN:
      return {
        ...state,
        categoryData: [],
        category: p.category,
        isLoadingCategoryData: true
      };
    case CATEGORY_DATA_SET:
      return {
        ...state,
        categoryData: p.categoryData,
        isLoadingCategoryData: false
      };
    case SUBCATEGORY_SET:
      return {
        ...state,
        subcategory: p.subcategory,
        subcategoryColumnIndex: p.columnIndex
      };
    case ITEM_SEARCH_QUERY_SET:
      return { ...state, isLoadingSearchData: true, query: p.query };
    case ITEM_SEARCH_DATA_SET:
      if (p.query === state.query) {
        return {
          ...state,
          subcategoryResults: p.subcategoryResults,
          categoryResults: p.categoryResults,
          itemResults: p.itemResults,
          isLoadingSearchData: false
        };
      }
      return state;
    case ITEM_SEARCH_DATA_RESET:
      return {
        ...state,
        subcategoryResults: [],
        categoryResults: [],
        itemResults: [],
        query: '',
        isLoadingSearchData: false
      };
    case SET_CUSTOM_ITEM_MODAL:
      return {
        ...state,
        customItemModalVisible: true,
        customItemModalText: action.payload
      };
    case HIDE_CUSTOM_ITEM_MODAL:
      return {
        ...state,
        customItemModalVisible: false,
        customItemModalText: ''
      };
    case ITEM_BARCODE_SEARCH_BEGIN:
      return {
        ...state,
        isSearchingItemBarcode: true,
        barcodeSearchResult: { success: false, item: [] }
      };
    case ITEM_BARCODE_SEARCH_SUCCESS:
      return {
        ...state,
        isSearchingItemBarcode: false,
        barcodeSearchResult: { success: true, items: p }
      };
    case ITEM_BARCODE_SEARCH_ERROR:
      return {
        ...state,
        isSearchingItemBarcode: false,
        barcodeSearchResult: { success: true, items: [] }
      };
    case ITEM_BARCODE_SEARCH_RESET:
      return {
        ...state,
        isSearchingItemBarcode: false,
        barcodeSearchResult: { success: false, items: [] }
      };
    case SEARCH_SUBCATEGORY_DATA_BEGIN:
      return { ...state, subcategorySelectLoading: true };
    case SEARCH_SUBCATEGORY_DATA_END:
      return { ...state, subcategorySelectLoading: false };
    default:
      return state;
  }
};
