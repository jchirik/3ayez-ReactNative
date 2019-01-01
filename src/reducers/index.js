import { combineReducers } from 'redux';

import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

// import AppSettings from './AppSettings_Reducer';
//
import Address from './Address_Reducer';
import Baskets from './Baskets_Reducer'
import SellerSearch from './SellerSearch_Reducer';
import Seller from './Seller_Reducer';
import Coupon from './Coupon_Reducer';
import Checkout from './Checkout_Reducer';

import ItemSearch from './ItemSearch_Reducer';
import Settings from './Settings_Reducer';
//
// import Addresses from './Addresses_Reducer';
//
// import Auth from './Auth_Reducer';
// import CurrentSeller from './CurrentSeller_Reducer';
// import CustomerData from './CustomerData_Reducer';
// import ItemSearchData from './ItemSearch_Reducer';
// import SellerSearch from './SellerSearch_Reducer';
// import WorkingOrders from './WorkingOrders_Reducer';
//
// import PlacedOrders from './PlacedOrders_Reducer';
//
// import SupportChat from './SupportChat_Reducer';
//
// import DriverLocation from './DriverLocation_Reducer';
// import CurrentArea from './CurrentArea_Reducer';
// import LocationSearch from './LocationSearch_Reducer';
//
// import CouponModal from './CouponModal_Reducer';
// import E_AddCreditCard_Reducer from './E_AddCreditCard_Reducer';
//
// import UX_AuthDetails from './UX_AuthDetails_Reducer'
// import UX_SubmitOrder from './UX_SubmitOrder_Reducer'
//
//
// import OrderTrack from './OrderTrack_Reducer';
// import OrderHistory from './OrderHistory_Reducer';

// Working Orders = only locally saved (the baskets for each store)
// Ongoing Orders = sent but currently processing, listening for updates
// All Orders = all past orders

const reducers = combineReducers({
  Baskets,
  Address,
  Checkout,
  Coupon,
  SellerSearch,
  Seller,
  ItemSearch,
  Settings
});

export default createStore(reducers, {}, applyMiddleware(ReduxThunk));
