import firebase from "react-native-firebase"
import { strings } from "../i18n.js"
import { PAYMENT_METHOD_SET, LOADING_ON, LOADING_OFF } from "./types"
import PayFortPaymentNativeModule from "../PayFortPayment/PayFortPaymentNativeModule"
import Toast from "react-native-root-toast"
import { toast } from "../Helpers"

const callPayFortNativeModule = (dispatch, SDKToken) => {
  PayFortPaymentNativeModule.pay(
    {
      [PayFortPaymentNativeModule.AMOUNT_KEY]: "1",
      [PayFortPaymentNativeModule.COMMAND_KEY]: PayFortPaymentNativeModule.AUTHORIZATION_COMMAND,
      [PayFortPaymentNativeModule.CURRENCY_KEY]: "EGP",
      [PayFortPaymentNativeModule.CUSTOMER_EMAIL_KEY]: "readyandroid@gmail.com",
      [PayFortPaymentNativeModule.LANGUAGE_KEY]: "ar",
      [PayFortPaymentNativeModule.MERCHANT_REFERENCE_KEY]: Date.now().toString(),
      [PayFortPaymentNativeModule.SDK_TOKEN_KEY]: SDKToken
    },
    (successResponse) => {
      toast(strings("CreditCard.cardCreationSuccess"), Toast.positions.CENTER)
      // add card to firebase
      // dispatch({ type: PAYMENT_METHOD_SET, payload: { payment_method: strings("PaymentMethod.creditCard") }})
    },
    (errorResponse) => {
      toast(strings("CreditCard.errorAddingCard"), Toast.positions.CENTER)
    }
  )
}

const getSDKToken = (dispatch) => {
  PayFortPaymentNativeModule.getDeviceID((id) => {
    // call backend to generate a token
    // on response: dispatch({ type: LOADING_OFF })
    // on success: callPayFortNativeModule(dispatch, "sdk_token")
    // on failure: toast(strings("CreditCard.errorAddingCard"), Toast.positions.CENTER)
  })
}

export const createCreditCard = () => {
  /**
   * get Device ID
   * get SDK token from backend
   * call payfort SDK
   * handle resonse
   */
  return (dispatch) => {
    // dispatch({ type: LOADING_ON })
    // getSDKToken(dispatch)
  }
}

export const deleteCreditCard = (card_id) => {
  return (dispatch) => {
    console.log("deleteCreditCard", card_id)
    const { currentUser } = firebase.auth()
    const cardRef = firebase
      .firestore()
      .collection("customers")
      .doc(currentUser.uid)
      .collection("cards")
      .doc(card_id)
    cardRef.delete().then(() => {
      console.log("deleteCreditCard successful", card_id, currentUser.uid)
    })
  }
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
