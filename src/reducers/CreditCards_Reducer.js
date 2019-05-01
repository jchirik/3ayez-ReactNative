import {
  CREDITCARDS_SET,
  CREDITCARDS_LISTENER_SET,
  CUSTOMER_DATA_RESET,
  LOADING_ON,
  LOADING_OFF
} from "../actions/types"

const INITIAL_STATE = {
  credit_cards: [],
  creditCardsListener: null,
  loading: false
}

export default (state = INITIAL_STATE, action) => {
  const p = action.payload
  switch (action.type) {
    case CREDITCARDS_LISTENER_SET:
      if (state.creditCardsListener !== null) {
        // TODO: this is very wrong. The `creditCardsListener` is the unsubscribe function that return from firebase snapshot
        state.creditCardsListener()
      }
      return { ...INITIAL_STATE, creditCardsListener: p.creditCardsListener }
    case CREDITCARDS_SET:
      return { ...state, credit_cards: p.credit_cards, loading: false }
    case CUSTOMER_DATA_RESET:
      if (state.creditCardsListener !== null) {
        state.creditCardsListener()
      }
      return INITIAL_STATE

    case LOADING_ON:
      return { ...state, loading: true }
    case LOADING_OFF:
      return { ...state, loading: false }

    default:
      return state
  }
}
