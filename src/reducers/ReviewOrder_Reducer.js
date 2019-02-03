import {
  REVIEW_ITEMS_DATA_BEGIN,
  REVIEW_ITEMS_DATA_SET,
  REVIEW_SUBSTITUTION_SET,

  SUBSTITUTION_OPTIONS_BEGIN,
  SUBSTITUTION_OPTIONS_SET
} from '../actions/types';

const INITIAL_STATE = {
  items: [],
  review_items: [],
  substitutions: [],
  is_loading: true,

  substitution_items: [],
  substitution_items_loading: false
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case REVIEW_ITEMS_DATA_BEGIN:
      return INITIAL_STATE;
    case REVIEW_ITEMS_DATA_SET:
      return {
        ...state,
        items: p.items,
        review_items: p.review_items,
        substitutions: p.review_items.map(() => null),
        is_loading: false
      };
    case REVIEW_SUBSTITUTION_SET:
      const substitutions = [ ...state.substitutions ];
      substitutions[p.index] = p.item;
      return { ...state, substitutions };
    case SUBSTITUTION_OPTIONS_BEGIN:
      return { ...state, substitution_items: [], substitution_items_loading: true };
    case SUBSTITUTION_OPTIONS_SET:
      return { ...state, substitution_items: p.substitution_items, substitution_items_loading: false };
    default:
      return state;
  }
};
