
import {
  CREDITCARDS_SET,
  CREDITCARDS_LISTENER_SET,
  CUSTOMER_DATA_RESET
} from '../actions/types';

const INITIAL_STATE = {
  credit_cards: [],
  creditCardsListener: null,
  loading: true
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case CREDITCARDS_LISTENER_SET:
      if (state.creditCardsListener !== null) { state.creditCardsListener(); }
      return { ...INITIAL_STATE, creditCardsListener: p.creditCardsListener };
    case CREDITCARDS_SET:
      return { ...state, credit_cards: p.credit_cards, loading: false };
    case CUSTOMER_DATA_RESET:
      if (state.creditCardsListener !== null) { state.creditCardsListener(); }
      return INITIAL_STATE;
    default:
      return state;
  }
};
