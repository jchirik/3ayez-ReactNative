
import {
  SELECTED_AREA_SET,
  SAVED_AREAS_SET,
  SAVED_AREAS_BEGIN,
  SAVED_AREAS_FAIL,

  CUSTOMER_DATA_RESET
} from '../actions/types';


const INITIAL_STATE = {
  selected_area: null,
  saved_areas: [],
  saved_areas_error: null,
  is_loading_saved_areas: false
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case SELECTED_AREA_SET:
      return { ...state, selected_area: p.selected_area }
    case SAVED_AREAS_SET:
      return { ...state, is_loading_saved_areas: false, saved_areas: p.saved_areas, selected_area: null }
    case SAVED_AREAS_FAIL:
      return { ...state, is_loading_saved_areas: false, saved_areas_error: p.error }
    case SAVED_AREAS_BEGIN:
      return { ...state, is_loading_saved_areas: true, saved_areas: [] }
    case CUSTOMER_DATA_RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
};
