//  Created by react-native-create-bridge

import { NativeModules } from 'react-native'

const { PayFortPayment } = NativeModules

export default {
  pay (params) {
    return PayFortPayment.pay(params)
  },

  AMOUNT_KEY: PayFortPayment.AMOUNT_KEY,
  CURRENCY_KEY: PayFortPayment.CURRENCY_KEY,
  CUSTOMER_EMAIL_KEY: PayFortPayment.CUSTOMER_EMAIL_KEY,
  LANGUAGE_KEY: PayFortPayment.LANGUAGE_KEY,
  MERCHANT_REFERENCE_KEY: PayFortPayment.MERCHANT_REFERENCE_KEY,
}
