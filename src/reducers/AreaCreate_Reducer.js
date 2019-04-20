
import {
  REGIONS_FETCH_BEGIN,
  REGIONS_FETCH_SET,
  AREA_RESULTS_FETCH_BEGIN,
  AREA_RESULTS_FETCH_SET,

  CURRENT_AREA_BEGIN,
  CURRENT_AREA_SET,
  CURRENT_AREA_ERROR
} from '../actions/types';


const INITIAL_STATE = {
  regions: [],
  area_results: [],
  is_loading_regions: false,
  is_loading_area_results: false,

  auto_area: null,
  auto_area_loading: false
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case REGIONS_FETCH_BEGIN:
      return { ...state, is_loading_regions: true, regions: [] }
    case REGIONS_FETCH_SET:
      return { ...state, is_loading_regions: false, regions: p.regions }
    case AREA_RESULTS_FETCH_BEGIN:
      return { ...state, is_loading_area_results: true }
    case AREA_RESULTS_FETCH_SET:
      return { ...state, is_loading_area_results: false, area_results: p.area_results }
    case CURRENT_AREA_BEGIN:
      return { ...state, auto_area: null, auto_area_loading: true };
    case CURRENT_AREA_SET:
      return { ...state, auto_area: p.area, auto_area_loading: false };
    case CURRENT_AREA_ERROR:
      return { ...state, auto_area: null, auto_area_loading: false };
    default:
      return state;
  }
};
