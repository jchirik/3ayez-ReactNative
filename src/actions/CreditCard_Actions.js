import firebase from "react-native-firebase"
import { strings } from "../i18n.js"
import { PAYMENT_METHOD_SET, LOADING_ON, LOADING_OFF } from "./types"
import PayFortPaymentNativeModule from "../PayFortPayment/PayFortPaymentNativeModule"
import {
  getLocale,
  getAuthorizeAmount,
  getCurrency,
  getLast4Digits,
  generateUUID
} from "../Helpers"
import { formatUTCDate, getMonth, getYear } from "../utils/date.js"
import { paymentBrand, cardToPaymentMethod } from "../utils/payment.js"
import { getEmail } from "../utils/user.js"
import { PayFort } from "../utils/constants.js"

const getCardFromResponse = payFortResponse => {
  let {
    language,
    token_name,
    payment_option,
    expiry_date,
    card_number,
    merchant_reference
  } = payFortResponse

  expiry_date = formatUTCDate(expiry_date, PayFort.DATE_FROMAT)

  return {
    merchant_reference,
    language,
    token: token_name,
    brand: paymentBrand(payment_option),
    exp_month: getMonth(expiry_date),
    exp_year: getYear(expiry_date),
    last4: getLast4Digits(card_number)
  }
}

const callPayFortNativeModule = (dispatch, SDKToken, language) => {
  PayFortPaymentNativeModule.pay(
    {
      [PayFortPaymentNativeModule.AMOUNT_KEY]: getAuthorizeAmount(),
      [PayFortPaymentNativeModule.COMMAND_KEY]:
        PayFortPaymentNativeModule.AUTHORIZATION_COMMAND,
      [PayFortPaymentNativeModule.CURRENCY_KEY]: getCurrency(),
      [PayFortPaymentNativeModule.CUSTOMER_EMAIL_KEY]: getEmail(),
      [PayFortPaymentNativeModule.LANGUAGE_KEY]: language,
      [PayFortPaymentNativeModule.MERCHANT_REFERENCE_KEY]: generateMerchantReference(),
      [PayFortPaymentNativeModule.SDK_TOKEN_KEY]: SDKToken
    },
    successResponse => {
      let cardInfo = getCardFromResponse(successResponse)
      let { currentUser } = firebase.auth()
      
      const saveCardRequest = firebase.functions().httpsCallable("saveCard")
      
      saveCardRequest({
        ...cardInfo, 
        customer_id: currentUser.uid
      }).then(async ({ data }) => {
        const cardRef = creditCardsRef = firebase
          .firestore()
          .collection("customers")
          .doc(currentUser.uid)
          .collection("cards")
          .doc(data.id)

        const card = await cardRef.get()

        dispatch({
          type: PAYMENT_METHOD_SET,
          payload: { payment_method: cardToPaymentMethod(card) }
        })
      }).catch(httpsError => {
        // TODO: Show error for user
        console.warn("Failed to save card: ", httpsError.message)
      })
    },
    errorResponse => {
      // TODO: Show error for user
      console.warn(strings("CreditCard.errorAddingCard"), ": ", errorResponse)
    }
  )
}

const getSDKToken = dispatch => {
  PayFortPaymentNativeModule.getDeviceID(async id => {
    const language = getLocale()

    const sdkTokenRequest = firebase
      .functions()
      .httpsCallable("generateSDKToken")
    sdkTokenRequest({ device_id: id })
      .then(({ data }) => {
        // Read result of the Cloud Function.
        console.warn("Generate sdk token success: ", data)
        const SDKToken = data.sdk_token
        callPayFortNativeModule(dispatch, SDKToken, language)
      })
      .catch(httpsError => {
        // TODO: Show error for user
        console.warn("Failed to fetch SDK Token: ", httpsError.message)
      })
      .finally(() => {
        dispatch({ type: LOADING_OFF })
      })
  })
}

export const createCreditCard = () => {
  return dispatch => {
    dispatch({ type: LOADING_ON })
    getSDKToken(dispatch)
  }
}

export const deleteCreditCard = card_id => {
  return dispatch => {
    console.warn("deleteCreditCard", card_id)
    const { currentUser } = firebase.auth()
    const cardRef = firebase
      .firestore()
      .collection("customers")
      .doc(currentUser.uid)
      .collection("cards")
      .doc(card_id)
    cardRef.delete().then(() => {
      console.warn("deleteCreditCard successful", card_id, currentUser.uid)
    }).catch(reason => {
      // TODO: Show error for user
      console.warn("Failed to delete the credit card: ", reason)
    })
  }
}

/**
 * Generate temporary identifier to use in saving credit card
 * transaction to get the credit token.
 */
const generateMerchantReference = () => {
  return generateUUID().replace(/-/g, '');
};
