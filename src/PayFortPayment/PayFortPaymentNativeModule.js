//  Created by react-native-create-bridge

import { NativeModules } from 'react-native'
import Config from 'react-native-config'
import { getLocale } from '../Helpers'
import { getSDKToken } from './PayFortAPI'

const { PayFortPayment } = NativeModules

const PAYFORT_KEYS = {
  COMMAND_KEY: PayFortPayment.COMMAND_KEY,
  MERCHANT_REFERENCE_KEY: PayFortPayment.MERCHANT_REFERENCE_KEY,
  AMOUNT_KEY: PayFortPayment.AMOUNT_KEY,
  CURRENCY_KEY: PayFortPayment.CURRENCY_KEY,
  LANGUAGE_KEY: PayFortPayment.LANGUAGE_KEY,
  CUSTOMER_EMAIL_KEY: PayFortPayment.CUSTOMER_EMAIL_KEY,
  SDK_TOKEN_KEY: PayFortPayment.SDK_TOKEN_KEY,
  ENVIRONMENT_KEY: PayFortPayment.ENVIRONMENT_KEY
}
export default {
  pay(params = getDefaultParams()) {
    PayFortPayment.getDeviceID(deviceID => {
      console.warn(deviceID)
    })
    return PayFortPayment.pay(
      params,
      response => {
        console.warn('Success:\n', response)
      },
      response => {
        console.warn('Fail:\n', response)
      }
    )
  },

  ...PAYFORT_KEYS,
  getDefaultParams
}

const getDefaultParams = () => {
  return {
    [PAYFORT_KEYS.COMMAND_KEY]: 'AUTHORIZATION',
    [PAYFORT_KEYS.MERCHANT_REFERENCE_KEY]: Date.now().toString(),
    [PAYFORT_KEYS.AMOUNT_KEY]: '1',
    [PAYFORT_KEYS.CURRENCY_KEY]: 'EGP',
    [PAYFORT_KEYS.LANGUAGE_KEY]: 'ar',
    [PAYFORT_KEYS.CUSTOMER_EMAIL_KEY]: 'test@domain.com',
    [PAYFORT_KEYS.SDK_TOKEN_KEY]: '8728DA009D7025F1E053321E320A85DB',
    [PAYFORT_KEYS.ENVIRONMENT_KEY]: Config.ENVIRONMENT
  }
}
