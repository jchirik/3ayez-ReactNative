import ReduxThunk from 'redux-thunk';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer, createTransform } from 'redux-persist';


import Auth from './Auth_Reducer';
import Addresses from './Addresses_Reducer';
import AddressArea from './AddressArea_Reducer';
import AddressCreate from './AddressCreate_Reducer';
import AddressSearch from './AddressSearch_Reducer';
import AddressSelect from './AddressSelect_Reducer';
import AddressPlaceDetails from './AddressPlaceDetails_Reducer';
import AddressReverseSearch from './AddressReverseSearch_Reducer';
import CurrentLocation from './CurrentLocation_Reducer';
import Customer from './Customer_Reducer';
import CreditCards from './CreditCards_Reducer';
import CreditCardCreate from './CreditCardCreate_Reducer';
import Baskets from './Baskets_Reducer';
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
import SupportManual from './SupportManual_Reducer';
import CustomerFeedback from './CustomerFeedback_Reducer';
import Timeslots from './Timeslots_Reducer';
import SupportChat from './SupportChat_Reducer';

const REDUCERS_NAMES = {
  Auth: 'Auth',
  Addresses: 'Addresses',
  AddressArea: 'AddressArea',
  AddressCreate: 'AddressCreate',
  AddressSearch: 'AddressSearch',
  AddressSelect: 'AddressSelect',
  AddressPlaceDetails: 'AddressPlaceDetails',
  AddressReverseSearch: 'AddressReverseSearch',
  CurrentLocation: 'CurrentLocation',
  Customer: 'Customer',
  CreditCards: 'CreditCards',
  CreditCardCreate: 'CreditCardCreate',
  Baskets: 'Baskets',
  SellerSearch: 'SellerSearch',
  Seller: 'Seller',
  Coupon: 'Coupon',
  Checkout: 'Checkout',
  ItemSearch: 'ItemSearch',
  Settings: 'Settings',
  OrderHistory: 'OrderHistory',
  OrderTracker: 'OrderTracker',
  DriverTracker: 'DriverTracker',
  OngoingOrders: 'OngoingOrders',
  ReviewOrder: 'ReviewOrder',
  SupportManual: 'SupportManual',
  CustomerFeedback: 'CustomerFeedback',
  Timeslots: 'Timeslots',
  SupportChat: 'SupportChat'
};

const reducers = combineReducers({
  [REDUCERS_NAMES.Auth]: Auth,
  [REDUCERS_NAMES.Baskets]: Baskets,
  [REDUCERS_NAMES.Customer]: Customer,
  [REDUCERS_NAMES.Addresses]: Addresses,
  [REDUCERS_NAMES.AddressArea]: AddressArea,
  [REDUCERS_NAMES.AddressSelect]: AddressSelect,
  [REDUCERS_NAMES.AddressCreate]: AddressCreate,
  [REDUCERS_NAMES.AddressSearch]: AddressSearch,
  [REDUCERS_NAMES.AddressPlaceDetails]: AddressPlaceDetails,
  [REDUCERS_NAMES.AddressReverseSearch]: AddressReverseSearch,
  [REDUCERS_NAMES.CurrentLocation]: CurrentLocation,
  [REDUCERS_NAMES.CreditCards]: CreditCards,
  [REDUCERS_NAMES.CreditCardCreate]: CreditCardCreate,
  [REDUCERS_NAMES.CustomerFeedback]: CustomerFeedback,
  [REDUCERS_NAMES.Checkout]: Checkout,
  [REDUCERS_NAMES.Coupon]: Coupon,
  [REDUCERS_NAMES.SellerSearch]: SellerSearch,
  [REDUCERS_NAMES.Seller]: Seller,
  [REDUCERS_NAMES.ItemSearch]: ItemSearch,
  [REDUCERS_NAMES.Settings]: Settings,
  [REDUCERS_NAMES.Timeslots]: Timeslots,
  [REDUCERS_NAMES.ReviewOrder]: ReviewOrder,
  [REDUCERS_NAMES.OrderHistory]: OrderHistory,
  [REDUCERS_NAMES.OrderTracker]: OrderTracker,
  [REDUCERS_NAMES.DriverTracker]: DriverTracker,
  [REDUCERS_NAMES.OngoingOrders]: OngoingOrders,
  [REDUCERS_NAMES.SupportChat]: SupportChat,
  [REDUCERS_NAMES.SupportManual]: SupportManual
});

const SupportChatTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState, _) => {
    const SUPPORT_MESSAGES_FOR_GROUP = 'support_messages_for_group'
    const NUMBER_OF_MESSAGES_TO_PERSIST = 25
    return { ...inboundState, [SUPPORT_MESSAGES_FOR_GROUP]: inboundState[SUPPORT_MESSAGES_FOR_GROUP].slice(0, NUMBER_OF_MESSAGES_TO_PERSIST) };
  },
  (outboundState, _) => {
    return { ...outboundState };
  },
  { whitelist: [REDUCERS_NAMES.SupportChat] }
);

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [REDUCERS_NAMES.SupportChat],
  transforms: [SupportChatTransform]
};

const store = createStore(persistReducer(persistConfig, reducers), {}, applyMiddleware(ReduxThunk));
export const persistor = persistStore(store);

export default store
