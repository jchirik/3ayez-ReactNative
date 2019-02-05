import {
  SUPPORT_MANUAL_SET
} from '../actions/types';

const INITIAL_STATE = {
  loading: true,
  manual: []
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case SUPPORT_MANUAL_SET:
      return { ...state, loading: false, manual: p.manual };
    default:
      return state;
  }
};
