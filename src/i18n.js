
import I18n from 'i18n-js';

import store from './reducers';

import en from '../locales/en.json';
import ar from '../locales/ar.json';

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
