/*
types for action-reducer
*/

// if the TYPE is being used in this version of the app, add it to this block

export const SELLERS_FETCH_BEGIN = 'SELLERS_FETCH_BEGIN';
export const SELLERS_FETCH_END = 'SELLERS_FETCH_END';
export const SELLERS_FETCH_ERROR = 'SELLERS_FETCH_ERROR';

export const SELLER_SELECT = 'SELLER_SELECT';

export const SELLER_PROMOTIONS_FETCH_END = 'SELLER_PROMOTIONS_FETCH_END';
export const SELLER_RECENTS_FETCH_END = 'SELLER_RECENTS_FETCH_END';
export const SELLER_FEATURED_FETCH_END = 'SELLER_FEATURED_FETCH_END';
export const SELLER_CATEGORIES_FETCH_END = 'SELLER_CATEGORIES_FETCH_END';

export const LOAD_BASKETS = 'LOAD_BASKETS';
export const RECHECK_PRICES = 'RECHECK_PRICES';

export const BASKET_INIT = 'BASKET_INIT';
export const BASKET_ITEM_INCR = 'BASKET_ITEM_INCR';
export const BASKET_ITEM_DECR = 'BASKET_ITEM_DECR';
export const BASKET_ITEMS_CLEAR = 'BASKET_ITEMS_CLEAR';

export const COUPON_CODE_RESET = 'COUPON_CODE_RESET';
export const COUPON_CODE_SUCCESS = 'COUPON_CODE_SUCCESS';
export const COUPON_CODE_FAILURE = 'COUPON_CODE_FAILURE';
export const COUPON_CODE_LOADING = 'COUPON_CODE_LOADING';

export const LOCALE_SET = 'LOCALE_SET';

export const FIRST_LAUNCH_STATUS_SET = 'FIRST_LAUNCH_STATUS_SET';

export const ADDRESSES_SET = 'ADDRESSES_SET';
export const ADDRESS_INDEX_SET = 'ADDRESS_INDEX_SET';

export const TIMESLOT_SET = 'TIMESLOT_SET';
export const TIP_SET = 'TIP_SET';
export const ORDER_NOTES_SET = 'ORDER_NOTES_SET';
export const PAYMENT_METHOD_SET = 'PAYMENT_METHOD_SET';

/* Address Creation */
export const ADDRESS_CREATE_RESET = 'ADDRESS_CREATE_RESET';
export const ADDRESS_REGION_SET = 'ADDRESS_REGION_SET';
export const ADDRESS_DETAIL_SET = 'ADDRESS_DETAIL_SET';

// for getting coord details from google places
export const ADDRESS_LOCATION_BEGIN = 'ADDRESS_LOCATION_BEGIN';
export const ADDRESS_LOCATION_SET = 'ADDRESS_LOCATION_SET';
export const ADDRESS_LOCATION_ERROR = 'ADDRESS_LOCATION_ERROR';

export const CURRENT_LOCATION_BEGIN = 'CURRENT_LOCATION_BEGIN';
export const CURRENT_LOCATION_SET = 'CURRENT_LOCATION_SET';
export const CURRENT_LOCATION_ERROR = 'CURRENT_LOCATION_ERROR';

export const ADDRESS_SEARCH_RESET = 'ADDRESS_SEARCH_RESET';
export const ADDRESS_SEARCH_BEGIN = 'ADDRESS_SEARCH_BEGIN';
export const ADDRESS_SEARCH_SET = 'ADDRESS_SEARCH_SET';

export const LOCATION_REVERSE_SEARCH_BEGIN = 'LOCATION_REVERSE_SEARCH_BEGIN'; // get street from pin
export const LOCATION_REVERSE_SEARCH_SET = 'LOCATION_REVERSE_SEARCH_SET';



/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */

// OLD TYPES from migration below
// they will be deleted, so if you are using any, place them above

/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */
/* ************************************************************************* */


/* Location */
export const AREA_SET = 'AREA_SET';

export const AREAS_FETCH_BEGIN = 'AREAS_FETCH_BEGIN';
export const AREAS_FETCH_SET = 'AREAS_FETCH_SET';
export const AREA_SEARCH_SET = 'AREA_SEARCH_SET';

export const FETCH_MAP_POINT_BEGIN = 'FETCH_MAP_POINT_BEGIN';
export const FETCH_MAP_POINT_END = 'FETCH_MAP_POINT_END';

export const UPDATE_WORKING_ADDRESS = 'UPDATE_WORKING_ADDRESS';
export const RESET_WORKING_ADDRESS = 'RESET_WORKING_ADDRESS';

export const ADDRESSES_FETCH_SET = 'ADDRESSES_FETCH_SET';
export const ADDRESSES_FETCH_BEGIN = 'ADDRESSES_FETCH_BEGIN';







export const SET_PRIOR_SCENE = 'SET_PRIOR_SCENE';

export const ALL_ORDERS_SET = 'ALL_ORDERS_SET';
export const ALL_ORDERS_BEGIN = 'ALL_ORDERS_BEGIN';

export const PAYMENT_METHOD_BEGIN = 'PAYMENT_METHOD_BEGIN';
export const PAYMENT_METHOD_FAIL = 'PAYMENT_METHOD_FAIL';

/* Fetching all subcat data for a category */
export const CATEGORY_DATA_BEGIN = 'CATEGORY_DATA_BEGIN';
export const CATEGORY_DATA_SET = 'CATEGORY_DATA_SET';

export const SUBCATEGORY_SET = 'SUBCATEGORY_SET';

export const SET_BASKETS = 'SET_BASKETS';
export const SET_SELLER_BASKET = 'SET_SELLER_BASKET';


export const TIMESLOTS_BEGIN = 'TIMESLOTS_BEGIN';
export const TIMESLOTS_FETCH_SET = 'TIMESLOTS_FETCH_SET';




export const PHONE_ENTRY_ATTEMPT = 'PHONE_ENTRY_ATTEMPT';
export const PHONE_ENTRY_SUCCESS = 'PHONE_ENTRY_SUCCESS';
export const PHONE_ENTRY_FAIL = 'PHONE_ENTRY_FAIL';


export const CHECK_IF_PROMO_SET = 'CHECK_IF_PROMO_SET';
export const CHECK_IF_RECENT_SET = 'CHECK_IF_RECENT_SET';


export const SET_CUSTOM_ITEM_MODAL = 'SET_CUSTOM_ITEM_MODAL';
export const HIDE_CUSTOM_ITEM_MODAL = 'HIDE_CUSTOM_ITEM_MODAL';

export const SHOW_STORE_MODAL = 'SHOW_STORE_MODAL';
export const HIDE_STORE_MODAL = 'HIDE_STORE_MODAL';

export const VERIFICATION_ATTEMPT = 'VERIFICATION_ATTEMPT';
export const VERIFICATION_SUCCESS = 'VERIFICATION_SUCCESS';
export const VERIFICATION_FAIL = 'VERIFICATION_FAIL';
export const VERIFICATION_RESET = 'VERIFICATION_RESET';

export const CREATE_CUSTOMER_DATA_ATTEMPT = 'CREATE_CUSTOMER_DATA_ATTEMPT';
export const CREATE_CUSTOMER_DATA_SUCCESS = 'CREATE_CUSTOMER_DATA_SUCCESS';
export const CREATE_CUSTOMER_DATA_FAIL = 'CREATE_CUSTOMER_DATA_FAIL';

export const ITEM_SEARCH_QUERY_SET = 'ITEM_SEARCH_QUERY_SET';
export const ITEM_SEARCH_CATEGORY_SET = 'ITEM_SEARCH_CATEGORY_SET';
export const ITEM_SEARCH_DATA_SET = 'ITEM_SEARCH_DATA_SET';
export const ITEM_SEARCH_DATA_RESET = 'ITEM_SEARCH_DATA_RESET';



export const SET_LOGIN_STATE = 'SET_LOGIN_STATE';
export const SET_PRIOR_STACK = 'SET_PRIOR_STACK';


export const ORDER_TRACK_LISTENER_SET = 'ORDER_TRACK_LISTENER_SET';
export const ORDER_TRACK_DATA_SET = 'ORDER_TRACK_DATA_SET';
export const ORDER_TRACK_LISTENER_RESET = 'ORDER_TRACK_LISTENER_RESET';

export const SUPPORT_MESSAGES_SET = 'SUPPORT_MESSAGES_SET';
export const SUPPORT_MESSAGES_LISTENER_SET = 'SUPPORT_MESSAGES_LISTENER_SET';

export const CHAT_SET = 'CHAT_SET';
export const CHAT_LISTENER_SET = 'CHAT_LISTENER_SET';


export const LOGIN_ATTEMPT = 'LOGIN_ATTEMPT';
export const LOGIN_ATTEMPT_SUCCESS = 'LOGIN_ATTEMPT_SUCCESS';
export const LOGIN_ATTEMPT_FAIL = 'LOGIN_ATTEMPT_FAIL';
export const LOGIN_ATTEMPT_RESET = 'LOGIN_ATTEMPT_RESET';

export const LOGOUT_ATTEMPT = 'LOGOUT_ATTEMPT';
export const LOGOUT_ATTEMPT_SUCCESS = 'LOGOUT_ATTEMPT_SUCCESS';
export const LOGOUT_ATTEMPT_FAIL = 'LOGOUT_ATTEMPT_FAIL';

export const VERIFICATION_ENTERED = 'VERIFICATION_ENTERED';

export const CUSTOMER_DATA_SET = 'CUSTOMER_DATA_SET';
export const CUSTOMER_DATA_LISTENER_SET = 'CUSTOMER_DATA_LISTENER_SET';
export const CUSTOMER_DATA_RESET = 'CUSTOMER_DATA_RESET';

export const CUSTOMER_POINTS_SET = 'CUSTOMER_POINTS_SET';
export const CUSTOMER_POINTS_LISTENER_SET = 'CUSTOMER_POINTS_LISTENER_SET';

export const TOGGLE_COUPON_MODAL = 'TOGGLE_COUPON_MODAL';


export const ACTIVE_ORDERS_SET = 'ACTIVE_ORDERS_SET';
export const ACTIVE_ORDERS_LISTENER_SET = 'ACTIVE_ORDERS_LISTENER_SET';
export const LAST_ORDER_SET = 'LAST_ORDER_SET';
export const SUBSTITUTION_ORDER_SET = 'SUBSTITUTION_ORDER_SET';

export const ORDER_HISTORY_SET = 'ORDER_HISTORY_SET';
export const ORDER_HISTORY_LISTENER_SET = 'ORDER_HISTORY_LISTENER_SET';
export const ORDER_HISTORY_LISTENER_RESET = 'ORDER_HISTORY_LISTENER_RESET';

export const DRIVER_LOCATION_SET = 'DRIVER_LOCATION_SET';
export const DRIVER_LISTENER_SET = 'DRIVER_LISTENER_SET';
export const DRIVER_LISTENER_RESET = 'DRIVER_LISTENER_RESET';

export const CURRENT_SELLER_BEGIN = 'CURRENT_SELLER_BEGIN';
export const CURRENT_SELLER_SELECT = 'CURRENT_SELLER_SELECT';
export const CURRENT_SELLER_RESET = 'CURRENT_SELLER_RESET';
export const CURRENT_SELLER_DETAILS = 'CURRENT_SELLER_DETAILS';
export const CURRENT_SELLER_LAYOUT = 'CURRENT_SELLER_LAYOUT';


export const SUBSTITUTION_SUBMIT_BEGIN = 'SUBSTITUTION_SUBMIT_BEGIN';
export const SUBSTITUTION_SUBMIT_END = 'SUBSTITUTION_SUBMIT_END';

export const SUBSTITUTION_OPTIONS_BEGIN = 'SUBSTITUTION_OPTIONS_BEGIN';
export const SUBSTITUTION_OPTIONS_SET = 'SUBSTITUTION_OPTIONS_SET';

// f
export const SELLER_SEARCH_BEGIN = 'SELLER_SEARCH_BEGIN';
export const SELLER_SEARCH_SET = 'SELLER_SEARCH_SET';

export const ORDER_SUBMIT_ATTEMPT = 'ORDER_SUBMIT_ATTEMPT';
export const ORDER_SUBMIT_SUCCESS = 'ORDER_SUBMIT_SUCCESS';
export const ORDER_SUBMIT_FAIL = 'ORDER_SUBMIT_FAIL';

export const ORDER_ITEM_ADD = 'ORDER_ITEM_ADD';
export const ORDER_ITEM_REMOVE = 'ORDER_ITEM_REMOVE';

export const SELECT_SELLER_LOAD = 'SELECT_SELLER_LOAD';

export const AUTH_SELLER_SELECT = 'AUTH_SELLER_SELECT';
