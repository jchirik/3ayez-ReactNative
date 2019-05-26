import Root from './00_Root';
import LanguageSelect from './01_Tutorial/01_LanguageSelect';
import TutorialSwipe from './01_Tutorial/02_TutorialSwipe';
import AreaSelect from './02_AreaSelect';
import StoreSelect from './03_StoreSelect';
import StoreSearch from './04_StoreSearch';
import StoreAisle from './05_StoreAisle';
import StoreShelf from './06_StoreShelf';
import ItemPage from './07_ItemPage';
import ItemImageView from './07_ItemPage/_components/ItemImageView';
import CustomProduct from './08_CustomProduct';
import WorkingBasket from './09_WorkingBasket';
import YallaTimeSelect from './10_YallaTimeSelect';
import TimeslotSelect from './11_TimeslotSelect';
import AddressSelect from './12_AddressSelect';
import Checkout from './12_Checkout';
import OrderTracker from './13_OrderTracker';
import OrderSummary from './13_OrderTracker/01_OrderSummary';
import DriverTracker from './13_OrderTracker/02_DriverTracker';
import OrderProblem from './13_OrderTracker/03_OrderProblem';
import OrderReview from './14_OrderReview';
import PhoneEntry from './15_Authentication/01_PhoneEntry';
import VerifyCode from './15_Authentication/02_VerifyCode';
import OrderHistory from './16_OrderHistory';
import SupportDetail from './17_SupportDetail';
import CouponModal from './18_CouponModal';
import CreditCardManager from './20_CreditCardManager';
import CreditCardCreate from './21_CreditCardCreate';
import AddressManager from './22_AddressManager';
import CustomerFeedback from './23_CustomerFeedback';
import AdditionalNotes from './24_AdditionalNotes';
import PrivacyPolicy from './25_PrivacyPolicy';
import TermsAndConditions from './26_TermsAndConditions';
import ReferralPage from './27_ReferralPage';
import BarcodeScanner from './28_BarcodeScanner';
import CurrentLocationSelect from './29_AddressCreate/01_CurrentLocationSelect';
import AddressSearch from './29_AddressCreate/02_AddressSearch';
import RefineLocation from './29_AddressCreate/03_RefineLocation';
import AddressDetails from './29_AddressCreate/04_AddressDetails';
import AreaCreate from './30_AreaCreate';
import ItemSubCategory from './31_ItemSubCategory';

export {
  Root,
  LanguageSelect,
  TutorialSwipe,
  AreaSelect,
  StoreSelect,
  StoreSearch,
  StoreAisle,
  StoreShelf,
  ItemPage,
  ItemImageView,
  CustomProduct,
  WorkingBasket,
  YallaTimeSelect,
  TimeslotSelect,
  AddressSelect,
  Checkout,
  OrderTracker,
  OrderSummary,
  DriverTracker,
  OrderProblem,
  OrderReview,
  PhoneEntry,
  VerifyCode,
  OrderHistory,
  SupportDetail,
  CouponModal,
  CreditCardManager,
  CreditCardCreate,
  AddressManager,
  CustomerFeedback,
  AdditionalNotes,
  PrivacyPolicy,
  TermsAndConditions,
  ReferralPage,
  BarcodeScanner,
  CurrentLocationSelect,
  AddressSearch,
  RefineLocation,
  AddressDetails,
  AreaCreate,
  ItemSubCategory
};

export const sceneKeys = {
  main: 'main',
  root: 'root',
  areaSelect: 'areaSelect',
  storeSelect: 'storeSelect',
  storeSearch: 'storeSearch',
  storeAisle: 'storeAisle',
  storeShelf: 'storeShelf',
  itemPage: 'itemPage',
  itemImageView: 'itemImageView',
  orderHistory: 'orderHistory',
  supportDetail: 'supportDetail',
  creditCardManager: 'creditCardManager',
  orderTracker: 'orderTracker',
  orderSummary: 'orderSummary',
  orderProblem: 'orderProblem',
  driverTracker: 'driverTracker',
  addressManager: 'addressManager',
  tutorial: 'tutorial',
  languageSelect: 'languageSelect',
  tutorialSwipe: 'tutorialSwipe',
  checkoutFlow: 'checkoutFlow',
  workingBasket: 'workingBasket',
  yallaTimeSelect: 'yallaTimeSelect',
  timeslotSelect: 'timeslotSelect',
  addressSelect: 'addressSelect',
  checkout: 'checkout',
  additionalNotes: 'additionalNotes',
  auth: 'auth',
  phoneEntry: 'phoneEntry',
  verifyCode: 'verifyCode',

  customProduct: 'customProduct',
  creditCardCreate: 'creditCardCreate',
  orderReview: 'orderReview',
  supportChat: 'supportChat',
  customerFeedback: 'customerFeedback',
  couponModal: 'couponModal',
  privacyPolicy: 'privacyPolicy',
  termsConditions: 'termsConditions',
  referralPage: 'referralPage',
  BarcodeScanner: 'BarcodeScanner',

  addressCreate: 'addressCreate',
  currentLocationSelect: 'currentLocationSelect',
  addressSearch: 'addressSearch',
  refineLocation: 'refineLocation',
  addressDetails: 'addressDetails',
  areaCreate: 'areaCreate',
  ItemSubCategory: 'ItemSubCategory'
};
