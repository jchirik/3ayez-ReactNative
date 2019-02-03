
import I18n from 'i18n-js';

import store from './reducers';

import en from '../locales/en.json';
import ar from '../locales/ar.json';

import moment from 'moment';
import enMomentLocalization from 'moment/locale/en-gb'
import arMomentLocalization from 'moment/locale/ar'

I18n.defaultLocale = 'en';
I18n.fallbacks = true;
I18n.translations = { en, ar };

// in setLocale -> set Moment locale, allow RTL
export const strings = (key, params = {}) => {
  const locale = store.getState().Settings.locale
  return I18n.t(key, { ...params, locale })
  // use params and regex to fill in the blanks
  // EXAMPLE:
  // relevant dictionary string = 'Welcome {{name}}'
  // input params = { name: 'John' }
  // output = 'Welcome John'
};

export const translate = (data) => {
  const locale = store.getState().Settings.locale;
  if (!data) { return ''; }
  if (locale === 'ar') {
    if (data.ar) { return data.ar; }
    if (data.title_arab) { return data.title_arab; }
  } else if (locale === 'en') {
    if (data.en) { return data.en; }
    if (data.title_engl) { return data.title_engl; }
  }
  return '';
}



export const formatTimestamp = (string, format) => {
  const locale = store.getState().Settings.locale;
  if (locale === 'en') {
    return moment(string).locale('en-gb', enMomentLocalization).format(format);
  } else if (locale === 'ar') {
    return moment(string).locale('ar', arMomentLocalization).format(format);
  }
  return '';
}

export const formatDay = (string) => {
  // provide natural day text for a given date
  const locale = store.getState().Settings.locale;
  if (locale === 'en') {
    return moment(string).locale('en-gb', enMomentLocalization).calendar(null, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      sameElse: 'L'
    });
  } else if (locale === 'ar') {
    return moment(string).locale('ar', arMomentLocalization).calendar(null, {
      sameDay: '[اليوم]',
      nextDay: '[غدًا]',
      nextWeek: 'dddd',
      sameElse: 'L'
    });
  }
  return '';
}





// export const parseTimestamp = (timestamp) => {
//
//   let monthString = Moment(timestamp).locale('ar').format('MMMM');
//   let dayString = Moment(timestamp).locale('en-gb').format('DD');
//
//   let dateString = `${monthString} ${dayString}`;
//   let yearString = Moment(timestamp).locale('en-gb').format('YYYY');
//   // use 'today' instead of date string if applicable
//   const today = new Date();
//   const time_t = new Date(timestamp);
//   const isToday = (today.toDateString() === time_t.toDateString());
//   if (isToday) { dateString = 'اليوم'; }
//
//   const timeString = Moment(timestamp).locale('en-gb').format('h:mm');
//   const ampmString = Moment(timestamp).locale('en-gb').format('A');
//
//   return ({ dateString, yearString, timeString, ampmString });
// };
