import { combineReducers } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import Auth from './Auth_Reducer';
import Addresses from './Addresses_Reducer';
import AddressArea from './AddressArea_Reducer';
import AddressCreate from './AddressCreate_Reducer';
import AddressSearch from './AddressSearch_Reducer';
import AddressSelect from './AddressSelect_Reducer';
import AddressPlaceDetails from './AddressPlaceDetails_Reducer';
import AddressReverseSearch from './AddressReverseSearch_Reducer';
import CurrentLocation from './CurrentLocation_Reducer';

import Customer from './Customer_Reducer'
import CreditCards from './CreditCards_Reducer';
import CreditCardCreate from './CreditCardCreate_Reducer';

import Baskets from './Baskets_Reducer'
import SellerSearch from './SellerSearch_Reducer';
import Seller from './Seller_Reducer';
import Coupon from './Coupon_Reducer';
import Checkout from './Checkout_Reducer';

import ItemSearch from './ItemSearch_Reducer';
import Settings from './Settings_Reducer';

import OrderHistory from './OrderHistory_Reducer';
import OrderTracker from './OrderTracker_Reducer';
import DriverTracker from './DriverTracker_Reducer';
import OngoingOrders from './OngoingOrders_Reducer';
import ReviewOrder from './ReviewOrder_Reducer';
import SupportManual from './SupportManual_Reducer'

import CustomerFeedback from './CustomerFeedback_Reducer';

import Timeslots from './Timeslots_Reducer';
import SupportChat from './SupportChat_Reducer';



const reducers = combineReducers({
  Auth,
  Baskets,
  Customer,

  Addresses,
  AddressArea,
  AddressSelect,
  AddressCreate,
  AddressSearch,
  AddressPlaceDetails,
  AddressReverseSearch,
  CurrentLocation,

  CreditCards,
  CreditCardCreate,

  CustomerFeedback,

  Checkout,
  Coupon,
  SellerSearch,
  Seller,
  ItemSearch,
  Settings,

  Timeslots,
  ReviewOrder,

  OrderHistory,
  OrderTracker,
  DriverTracker,
  OngoingOrders,

  SupportChat,
  SupportManual
});

export default createStore(reducers, {}, applyMiddleware(ReduxThunk));
