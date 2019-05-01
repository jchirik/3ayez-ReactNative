
import { storeCard } from "./CreditCardStorage"
import axios from "axios"
import { sha256 } from "react-native-sha256"

const payfortURl = "https://sbpaymentservices.payfort.com/FortAPI/paymentApi"

export const generateSDKToken = async data => {
  const params = getTokenParams(data)
  if (!params.device_id) {
    throw httpsError(
      "invalid-argument",
      "Required params: device_id"
    )
  }

  const requestBody = {
    service_command: "SDK_TOKEN",
    device_id: params.device_id
  }

  return callPayfort(requestBody)
    .then(response => {
      return { data: { sdk_token: response.sdk_token } }
    })
    .catch(error => {
      throw httpsError("internal", error.message)
    })
}

export const saveCard = async data => {
  const params = getCardParams(data)

  validateCardParams(params)

  const requestBody = {
    command: "VOID_AUTHORIZATION",
    merchant_reference: params.merchant_reference
  }

  return callPayfort(requestBody)
    .then(async response => {
      const cardParams = {
        token: params.token,
        brand: params.brand,
        country: params.country || "EG",
        exp_month: params.exp_month,
        exp_year: params.exp_year,
        last4: params.last4
      }

      let cardID = await storeCard(cardParams)
      return { data: { id: cardID } }
    })
    .catch(error => {
      throw httpsError("internal", error.message)
    })
}

const callPayfort = async params => {
  const requestBody = {
    ...params,
    access_code: "GQPvGDRK03xk2g2LYyQq",
    merchant_identifier: "MngwvyYO",
    language: params.language || "en"
  }

  requestBody.signature = await generateSignature(requestBody, "sdfafga")

  return axios
    .post(payfortURl, requestBody)
    .then(async response => {
      const signature = response.data.signature
      delete response.data.signature
      if ((await generateSignature(response.data, "SDGADFHGJ")) !== signature)
        throw httpsError("internal", "Wrong signature")
      return response.data
    })
    .catch(error => {
      throw httpsError("internal", error.message)
    })
}

const getTokenParams = data => {
  const { device_id, language } = data

  return removeUndefinedProperties({
    device_id,
    language
  })
}

const getCardParams = data => {
  const {
    merchant_reference,
    language,
    customer_id,
    token,
    brand,
    country,
    exp_month,
    exp_year,
    last4
  } = data

  return removeUndefinedProperties({
    merchant_reference,
    language,
    customer_id,
    token,
    brand,
    country,
    exp_month: Number(exp_month),
    exp_year: Number(exp_year),
    last4
  })
}

const validateCardParams = params => {
  if (
    !params.merchant_reference ||
    !params.customer_id ||
    !params.token ||
    !params.brand ||
    !params.exp_month ||
    !params.exp_year ||
    !params.last4
  )
    throw httpsError(
      "invalid-argument",
      "Missed required arguments"
    )

  return
}

const generateSignature = async (params, passphrase) => {
  const signature =
    Object.keys(params)
      .sort()
      .reduce(
        (accumlator, key) => accumlator + `${key}=${params[key]}`,
        passphrase
      ) + passphrase

  const hash = await sha256(signature)
  return hash
}

const removeUndefinedProperties = object => {
  Object.keys(object).forEach(key => {
    if (object[key] == undefined) {
      delete object[key]
    } else if (object[key] instanceof Object) {
      removeUndefinedProperties(object[key])
    }
  })
  return object
}

const httpsError = (code, message) => ({ code, message })
