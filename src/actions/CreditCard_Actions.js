import firebase from "react-native-firebase"
import { strings } from "../i18n.js"
import { PAYMENT_METHOD_SET, LOADING_ON, LOADING_OFF, CREDITCARDS_SET } from "./types"
import PayFortPaymentNativeModule from "../PayFortPayment/PayFortPaymentNativeModule"
import Toast from "react-native-root-toast"
import {
  toast,
  getLocale,
  getAuthorizeAmount,
  getCurrency,
  getLast4Digits,
  generateMerchantReference
} from "../Helpers"
import { generateSDKToken, saveCard } from "../mocks/FirebasePayment.js"
import { formatUTCDate, getMonth, getYear } from "../utils/date.js"
import {
  removeCard,
  getCreditCards,
  getCard
} from "../mocks/CreditCardStorage.js"
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
      // toast(strings("CreditCard.cardCreationSuccess"), Toast.positions.CENTER)
      // add card to firebase
      // dispatch({ type: PAYMENT_METHOD_SET, payload: { payment_method: strings("PaymentMethod.creditCard") }})
      console.warn(
        strings("CreditCard.cardCreationSuccess"),
        "\n",
        successResponse
      )
      let cardInfo = getCardFromResponse(successResponse)
      let { currentUser } = firebase.auth()

      // TODO: call firebase cloud function `saveCard`
      saveCard({
        ...cardInfo,
        customer_id: currentUser.uid
      }).then(async ({ data }) => {
        const card = await getCard(data.id)
        retrieveCreditCards(dispatch)
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
      // toast(strings("CreditCard.errorAddingCard"), Toast.positions.CENTER)
      // TODO: Show error for user
      console.warn(strings("CreditCard.errorAddingCard"), ": ", errorResponse)
    }
  )
}

const getSDKToken = dispatch => {
  PayFortPaymentNativeModule.getDeviceID(async id => {
    // call backend to generate a token
    // on response: dispatch({ type: LOADING_OFF })
    // on success: callPayFortNativeModule(dispatch, "sdk_token")
    // on failure: toast(strings("CreditCard.errorAddingCard"), Toast.positions.CENTER)
    const language = getLocale()

    // TODO: call firebase cloud function `generateSDKToken`
    generateSDKToken({
      device_id: id,
      language
    })
      .then(({ data }) => {
        console.warn("Generate sdk token success: ", data, language)
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
  /**
   * get Device ID
   * get SDK token from backend
   * call payfort SDK
   * handle resonse
   */
  return dispatch => {
    dispatch({ type: LOADING_ON })
    getSDKToken(dispatch)
  }
}

export const deleteCreditCard = card_id => {
  return dispatch => {
    // console.warn("deleteCreditCard", card_id)
    // const { currentUser } = firebase.auth()
    // const cardRef = firebase
    //   .firestore()
    //   .collection("customers")
    //   .doc(currentUser.uid)
    //   .collection("cards")
    //   .doc(card_id)
    // cardRef.delete().then(() => {
    //   console.log("deleteCreditCard successful", card_id, currentUser.uid)
    //   retrieveCreditCards(dispatch)
    // })
    
    removeCard(card_id).then(status => {
      console.warn("Delete card: ", card_id, status)
      if (status) {
        retrieveCreditCards(dispatch)
      } else {
        // TODO: Show error for user
        console.warn("deleteCreditCard failed", card_id, currentUser.uid)
      }
    })
  }
}

export const retrieveCreditCards = dispatch => {
  getCreditCards().then(cards => {
    const credit_cards = cards.map(card => cardToPaymentMethod(card))
    dispatch({ type: CREDITCARDS_SET, payload: { credit_cards } })
  })
}

// export const createStripeCard = (card_data) => {
//   return (dispatch) => {
//     const { currentUser } = firebase.auth()
//     const { name, number, expiry, cvc, type } = card_data

//     dispatch({ type: CREDITCARD_CREATE_BEGIN })

//     const expirySplit = expiry.split("/")
//     const params = {
//       // mandatory
//       number,
//       expMonth: parseInt(expirySplit[0], 10),
//       expYear: parseInt(expirySplit[1], 10),
//       cvc,
//       // optional
//       name
//     }
//     stripe
//       .createTokenWithCard(params)
//       .then((success) => {
//         console.log("createStripeCard success", success)
//         const cardData = success.card
//         const card = {
//           type: "CREDIT",
//           id: cardData.cardId,
//           token: success.tokenId,
//           brand: cardData.brand,
//           country: cardData.country,
//           exp_month: cardData.expMonth,
//           exp_year: cardData.expYear,
//           last4: cardData.last4,
//           customer_id: currentUser.uid
//         }

//         const addStripeCreditCard = firebase.functions().httpsCallable("addStripeCreditCard")
//         addStripeCreditCard(card)
//           .then((result) => {
//             console.log("addStripeCreditCard returned", result)
//             if (result.data && result.data.success) {
//               dispatch({
//                 type: PAYMENT_METHOD_SET,
//                 payload: { payment_method: card }
//               })
//               dispatch({ type: CREDITCARD_CREATE_SUCCESS })
//               navigateBack()
//             } else {
//               dispatch({ type: CREDITCARD_CREATE_FAIL, payload: { error: "Invalid from server" } })
//               console.log("credit card error")
//             }
//           })
//           .catch((error) => {
//             dispatch({ type: CREDITCARD_CREATE_FAIL, payload: { error } })
//             console.log("credit card error")
//           })
//       })
//       .catch((error) => {
//         dispatch({ type: CREDITCARD_CREATE_FAIL, payload: { error } })
//         console.log("CREDIT CARD", error)
//       })
//   }
// }

// export const createStripeCardReset = () => {
//   return (dispatch) => {
//     dispatch({ type: CREDITCARD_CREATE_RESET })
//   }
// }
