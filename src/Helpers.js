import _ from 'lodash';
import {
  Platform,
  Dimensions,
  AsyncStorage
} from 'react-native';
import Moment from 'moment';
import { Actions } from 'react-native-router-flux';
import store from './reducers';

import en from '../locales/en.json';
import ar from '../locales/ar.json';

export const strings = (key) => {
  const locale = store.getState().Settings.locale
  // if none, set it to arabic and save persistently
  let string = {};
  switch (locale) {
    case 'ar':
      string = ar;
      break;
    case 'en':
      string = en;
      break;
  }
  // recursively dig in to the dictionary
  key.split('.').forEach((keyLayer) => { string = string[keyLayer]; });
  return string;
};



// calculated dynamically in page
export const calculateTotal = (basket, checkout, coupon) => {
  const { subtotal } = basket;
  const { delivery_fee, tip } = checkout;
  let total = subtotal;
  // add in the coupon to the auto_total
  if (coupon && parseFloat(coupon.amount)) {
    // ensure we're above the coupon min, if it exists
    if (!(coupon.minimum && total < parseFloat(coupon.minimum))) {
      if (coupon.type === 'pound_discount') {
        coupon_discount = parseFloat(coupon.amount);
        total -= coupon_discount;
      }
      if (coupon.type === 'percent_discount') {
        coupon_discount = total * parseFloat(coupon.amount);
        total -= coupon_discount;
      }
    }
  }
  // ensure totals are > 0
  total = Math.max(total, 0);
  // add in delivery fee for the total
  total = total + (delivery_fee || 0);
  total = total + (tip || 0);
  total = Math.round(total * 1000) / 1000;
  return total;
}


export const calculateSuggestedTips = (preTipTotal) => {
  let lowerBound = preTipTotal;
  let upperBound = preTipTotal * 1.20;
  lowerBound = Math.ceil(lowerBound/5)*5;

  let finalTotals = [];
  for (let i = lowerBound; i < upperBound; i+=5) {
    finalTotals.push(i);
  }

  // if more than 4 suggestions, filter to only those divisible by 10, 20 or 50
  if (finalTotals.length > 4) {
    finalTotals = finalTotals.filter(total => !(total%10) || !(total%20) || !(total%50))
  }

  // if more than 4 suggestions, filter to only those divisible by 10, 20 or 50
  if (finalTotals.length > 4) {
    finalTotals = finalTotals.filter(total => !(total%20) || !(total%50))
  }

  const finalTips = finalTotals.map(total => total-preTipTotal);
  return [ 0.00, ...finalTips ];
}



















export const localizeDN = (display_name) => {
  const locale = store.getState().Settings.locale;
  if (display_name[locale]) {
    return display_name[locale];
  }
  return display_name.ar;
}

export const localizeItem = (item) => {
  const locale = store.getState().Settings.locale;
  if (locale === 'en') {
    return item.title_engl;
  }
  return item.title_arab;
}

export const isIPhoneX = () => {
  const { height, width } = Dimensions.get('window');
  return (
    // has to be ios
    Platform.OS === 'ios' &&
    // Accounting for the height in either orientation
    (height === 812 || width === 812)
  );
};


export const statusBarMargin = (Platform.OS === 'ios') ? (isIPhoneX() ? 35 : 20) : 5;


export const isAndroid = (Platform.OS === 'android');



export const STATUS_BAR_HEIGHT = (Platform.OS === 'ios') ? (isIPhoneX() ? 35 : 20) : 5;
export const AYEZ_GREEN = '#2DD38F';





//
//
// export const onAddressSelectComplete = (originPage) => {
//   switch (originPage) {
//     case 'workingBasket':
//       Actions.deliveryTime();
//       return;
//     case 'storeCategories':
//       Actions.popTo('storeCategories');
//       return;
//     default:
//       console.log('invalid address origin')
//       return;
//   }
// };
//
// export const onAddressSelectBack = (originPage) => {
//   switch (originPage) {
//     case 'workingBasket':
//       console.log('onAddressSelectBack: popping to Working Basket')
//       Actions.popTo('workingBasket');
//       return;
//     case 'storeCategories':
//       console.log('onAddressSelectBack: popping to Store Categories')
//       Actions.popTo('storeCategories');
//       return;
//     default:
//       console.log('invalid address origin')
//       return;
//   }
// };





// const ORDER_SENT = require('../assets/images/order_statuses/sent.png');
// const ORDER_PACKING = require('../assets/images/order_statuses/packing.png');
// const ORDER_DELIVERY = require('../assets/images/order_statuses/delivery.png');
// const ORDER_PROBLEM = require('../assets/images/order_statuses/problem.png');


// export const statusDictionary = {
//   0: { text: strings('OrderStatuses.0'), icon: ORDER_SENT, color: '#28BC7A' },
//   50: { text: strings('OrderStatuses.50'), icon: ORDER_PACKING, color: '#28BC7A' },
//   100: { text: strings('OrderStatuses.100'), icon: ORDER_DELIVERY, color: '#28BC7A' },
//   150: { text: strings('OrderStatuses.150'), icon: ORDER_DELIVERY, color: '#28BC7A' },
//   200: { text: strings('OrderStatuses.200'), icon: null, color: '#ADADAD' },
//   300: { text: strings('OrderStatuses.300'), icon: null, color: '#ADADAD' },
//   400: { text: strings('OrderStatuses.400'), icon: ORDER_PROBLEM, color: '#D91212' }
// };

export const parseTimestamp = (timestamp) => {

  let monthString = Moment(timestamp).locale('ar').format('MMMM');
  let dayString = Moment(timestamp).locale('en-gb').format('DD');

  let dateString = `${monthString} ${dayString}`;
  let yearString = Moment(timestamp).locale('en-gb').format('YYYY');
  // use 'today' instead of date string if applicable
  const today = new Date();
  const time_t = new Date(timestamp);
  const isToday = (today.toDateString() === time_t.toDateString());
  if (isToday) { dateString = 'اليوم'; }

  const timeString = Moment(timestamp).locale('en-gb').format('h:mm');
  const ampmString = Moment(timestamp).locale('en-gb').format('A');

  return ({ dateString, yearString, timeString, ampmString });
};





// const cashIcon = require('../assets/images/payment_methods/cash.png');
// const cardIcon = require('../assets/images/payment_methods/card.png');
// const cardReaderIcon = require('../assets/images/payment_methods/card_reader.png');
//
//
// export const parsePayment = (payment) => {
//   if (!payment) { return {}; }
//
//   switch (payment.type) {
//     case 'CASH':
//       return { text: strings('Payment.cash'), icon: cashIcon };
//     case 'CARDREADER':
//       return { text: strings('Payment.cardreader'), icon: cardReaderIcon };
//     case 'ADDCARD':
//       return { text: strings('Payment.addcard'), icon: cardIcon };
//     default:
//       return { text: `${payment.brand} ${payment.last4}`, icon: cardIcon };
//   }
// };



// const baby = require('../assets/images/bundled_categories/baby.png');
// const bakery = require('../assets/images/bundled_categories/bakery.png');
// const beauty_hygiene = require('../assets/images/bundled_categories/beauty_hygiene.png');
// const canned = require('../assets/images/bundled_categories/canned.png');
// const coffee_tea = require('../assets/images/bundled_categories/coffee_tea.png');
// const dairy = require('../assets/images/bundled_categories/dairy.png');
// const deli = require('../assets/images/bundled_categories/deli.png');
// const frozen = require('../assets/images/bundled_categories/frozen.png');
// const household = require('../assets/images/bundled_categories/household.png');
// const meat_fish = require('../assets/images/bundled_categories/meat_fish.jpg');
// const nuts = require('../assets/images/bundled_categories/nuts.jpg');
// const pantry = require('../assets/images/bundled_categories/pantry.jpg');
// const pets = require('../assets/images/bundled_categories/pets.jpg');
// const produce = require('../assets/images/bundled_categories/produce.jpg');
// const snacks = require('../assets/images/bundled_categories/snacks.jpg');
// const spices = require('../assets/images/bundled_categories/spices.jpg');




// const bakery = require('../assets/images/bundled_categories/bakery.jpg');
// const baking = require('../assets/images/bundled_categories/baking.jpg');
// const beverages = require('../assets/images/bundled_categories/beverages.jpg');
//
// const canned = require('../assets/images/bundled_categories/canned.jpg');
// const cereals_oats = require('../assets/images/bundled_categories/cereals_oats.jpg');
// const child_care = require('../assets/images/bundled_categories/child_care.jpg');
//
// const cooking = require('../assets/images/bundled_categories/cooking.jpg');
// const dairy = require('../assets/images/bundled_categories/dairy.jpg');
// const deli = require('../assets/images/bundled_categories/deli.jpg');
//
// const frozen = require('../assets/images/bundled_categories/frozen.jpg');
// const health_hygiene = require('../assets/images/bundled_categories/health_hygiene.jpg');
// const hot_drinks = require('../assets/images/bundled_categories/hot_drinks.jpg');
//
// const household = require('../assets/images/bundled_categories/household.jpg');
// const jams_spreads = require('../assets/images/bundled_categories/jams_spreads.jpg');
// const meat_poultry = require('../assets/images/bundled_categories/meat_poultry.jpg');
//
// const nuts_seeds = require('../assets/images/bundled_categories/nuts_seeds.jpg');
// const oils_vinegars = require('../assets/images/bundled_categories/oils_vinegars.jpg');
// const pets = require('../assets/images/bundled_categories/pets.jpg');
//
// const produce = require('../assets/images/bundled_categories/produce.jpg');
// const pulses_grains = require('../assets/images/bundled_categories/pulses_grains.jpg');
// const rice_pasta = require('../assets/images/bundled_categories/rice_pasta.jpg');
//
// const sauces = require('../assets/images/bundled_categories/sauces.jpg');
// const sweets_snacks = require('../assets/images/bundled_categories/sweets_snacks.jpg');
// const water = require('../assets/images/bundled_categories/water.jpg');
//
// const bundledCategoryImages = {
//   bakery,
//   baking,
//   beverages,
//   canned,
//   cereals_oats,
//   child_care,
//   cooking,
//   dairy,
//   deli,
//   frozen,
//   health_hygiene,
//   hot_drinks,
//   household,
//   jams_spreads,
//   meat_poultry,
//   nuts_seeds,
//   oils_vinegars,
//   pets,
//   produce,
//   pulses_grains,
//   rice_pasta,
//   sauces,
//   sweets_snacks,
//   water
// };
//
//
//
// export const fetchCategoryImage = (filterCode) => {
//   const bundledImage = bundledCategoryImages[filterCode];
//   if (bundledImage) {
//     return bundledImage;
//   } else {
//     return null;
//   }
// };


export const parseCouponError = (error) => {
  switch (error) {
    case 'BADCONNECTION':
      return strings('CouponModal.BADCONNECTION');
    case 'NOTCOUPON':
      return strings('CouponModal.NOTCOUPON');
    case 'MAXUSED':
      return strings('CouponModal.MAXUSED');
    case 'EXPIRED':
      return strings('CouponModal.EXPIRED');
    case 'SELLERINVALID':
      return strings('CouponModal.SELLERINVALID');
    case 'FIRSTTIMEONLY':
      return strings('CouponModal.FIRSTTIMEONLY');
    case 'ALREADYUSED':
      return strings('CouponModal.ALREADYUSED');
    default:
      return strings('CouponModal.DEFAULTERROR');
  }
};


export const fetchRegionDisplayName = (regionCode) => {
  switch (regionCode) {
    case 'ALEXANDRIA':
      return strings('Regions.alexandria');
    case 'SAHEL':
      return strings('Regions.sahel');
    case 'CAIRO':
      return strings('Regions.cairo');
    default:
      return '';
  }
};


export const checkIfOpen = (hours) => {

  // get the milliseconds into the day
  const currentTime = Date.now();
  const currentLocaleTime = Moment(currentTime).tz('Africa/Cairo');
	const midnightLocaleTime = Moment(currentTime).tz('Africa/Cairo');
	midnightLocaleTime.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
	const millisPassed = currentLocaleTime.valueOf() - midnightLocaleTime.valueOf();

  // if 24/7, return true
  if (hours.start === hours.end) { return true; }

  let isOpen = false;
  // check all the valid time ranges (X to midnight, midnight to Y)
  if (hours.start < millisPassed && hours.end > millisPassed) { isOpen = true; }
  if (hours.end > 86400000) {
    let hoursEndNextDay = hours.end - 86400000;
    if (hoursEndNextDay > millisPassed) { isOpen = true; }
  }

  return isOpen;
}


// const cairoRegion = require('../assets/images/region_images/pyramid.png');
// const alexandriaRegion = require('../assets/images/region_images/lighthouse.png');
// const sahelRegion = require('../assets/images/region_images/palm.png');
//
// export const fetchRegionImage = (regionCode) => {
//   switch (regionCode) {
//     case 'ALEXANDRIA':
//       return alexandriaRegion;
//     case 'SAHEL':
//       return sahelRegion;
//     case 'CAIRO':
//       return cairoRegion;
//     default:
//       return null;
//   }
// };


export const padNumberZeros = (num, size) => {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}





export const creditCardIcon = (brand) => {
  if (!brand) { return null; }
  const dir = '../assets/images_v2/Payment/creditcards';
  switch (brand.toUpperCase()) {
    case 'VISA':
      return require(`${dir}/visa.png`);
    case 'MASTERCARD':
      return require(`${dir}/mastercard.png`);
    case 'AMERICAN EXPRESS':
      return require(`${dir}/amex.png`);
    case 'MAESTRO':
      return require(`${dir}/maestro.png`);
    case 'DISCOVER':
      return require(`${dir}/discover.png`);
    case 'DINERS CLUB':
      return require(`${dir}/diners.png`);
    case 'JCB':
      return require(`${dir}/jcb.png`);
    default:
      return require(`${dir}/credit.png`);
  }
};
