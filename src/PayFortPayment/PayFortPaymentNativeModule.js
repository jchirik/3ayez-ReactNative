//  Created by react-native-create-bridge

import { NativeModules } from "react-native"

const { PayFortPayment } = NativeModules

export default {
  pay(params, successCallback, failureCallback) {
    return PayFortPayment.pay(params, successCallback, failureCallback)
  },

  getDeviceID(callback) {
    return PayFortPayment.getDeviceID(callback)
  },

  AMOUNT_KEY: PayFortPayment.AMOUNT_KEY,
  COMMAND_KEY: PayFortPayment.COMMAND_KEY,
  CURRENCY_KEY: PayFortPayment.CURRENCY_KEY,
  CUSTOMER_EMAIL_KEY: PayFortPayment.CUSTOMER_EMAIL_KEY,
  LANGUAGE_KEY: PayFortPayment.LANGUAGE_KEY,
  MERCHANT_REFERENCE_KEY: PayFortPayment.MERCHANT_REFERENCE_KEY,
  SDK_TOKEN_KEY: PayFortPayment.SDK_TOKEN_KEY,

  AUTHORIZATION_COMMAND: PayFortPayment.AUTHORIZATION_COMMAND,
  PURCHASE_COMMAND: PayFortPayment.PURCHASE_COMMAND
}
