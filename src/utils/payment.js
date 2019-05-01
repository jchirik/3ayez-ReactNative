export const PAYMENT_BRANDS = Object.freeze({
  VISA: "VISA",
  MASTERCARD: "MASTERCARD",
  AMEX: "AMERICAN EXPRESS",
  MAESTRO: "MAESTRO",
  DISCOVER: "DISCOVER",
  DINERSCLUB: "DINERS CLUB",
  JCB: "JCB",
  CREDIT: "CREDIT"
})

export const PAYFORT_PAYMENT_OPTIONS = Object.freeze({
  VISA: PAYMENT_BRANDS.VISA,
  MASTERCARD: PAYMENT_BRANDS.MASTERCARD,
  AMEX: PAYMENT_BRANDS.AMEX,
  MADA: PAYMENT_BRANDS.MADA,
  MEEZA: PAYMENT_BRANDS.MEEZA
})

export const paymentBrand = payfortPaymentOption => {
  console.log("Trying to get brand of: ", payfortPaymentOption)
  if (payfortPaymentOption in PAYFORT_PAYMENT_OPTIONS) {
    return PAYFORT_PAYMENT_OPTIONS[payfortPaymentOption]
  } else {
    return PAYMENT_BRANDS.CREDIT
  }
}

export const cardToPaymentMethod = card => {
  const id = card.id
  const data = card.data
  return { ...data, id, type: "CREDIT" }
}
