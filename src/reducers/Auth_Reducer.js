// handles everything to do with authentication
import {
  AUTH_PHONE_SET,
  AUTH_COUNTRY_CODE_SET,
  AUTH_VERIFICATION_SET,

  AUTH_INIT,

  // login attempt
  PHONE_ENTRY_BEGIN,
  PHONE_ENTRY_SUCCESS,
  PHONE_ENTRY_FAIL,

  VERIFICATION_BEGIN,
  VERIFICATION_SUCCESS,
  VERIFICATION_FAIL,

  GUEST_LOGIN_BEGIN,
  GUEST_LOGIN_SUCCESS,
  GUEST_LOGIN_FAIL,

  ROBOCALL_BEGIN,
  ROBOCALL_SUCCESS,
  ROBOCALL_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  phone: '',
  country_code: 'EG',
  call_code: '20',
  phone_loading: false,
  phone_error: '',

  verification: '',
  verification_loading: false,
  verification_error: '',


  guestlogin_loading: false,
  guestlogin_error: '',

  login_attempt_id: null,

  onComplete: null,

  robocall_loading: false,
  robocall_error: null
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case AUTH_INIT:
      return { ...INITIAL_STATE, onComplete: p.onComplete };
    case AUTH_PHONE_SET:
      return { ...state, phone: p.phone };
    case AUTH_COUNTRY_CODE_SET:
      return { ...state, country_code: p.country_code, call_code: p.call_code };
    case AUTH_VERIFICATION_SET:
      return { ...state, verification: p.verification };
    case PHONE_ENTRY_BEGIN:
      return { ...state, phone_loading: true, phone_error: '' };
    case PHONE_ENTRY_SUCCESS:
      return {
        ...state,
        login_attempt_id: p.login_attempt_id,
        phone_loading: false
      };
    case PHONE_ENTRY_FAIL:
      return { ...state, phone_error: p.error, phone_loading: false };
    case VERIFICATION_BEGIN:
      return { ...state, verification_error: '', verification_loading: true };
    case VERIFICATION_SUCCESS:
      return { ...state, verification_loading: false, onComplete: null };
    case VERIFICATION_FAIL:
      return { ...state, verification_error: p.error, verification_loading: false };
    case GUEST_LOGIN_BEGIN:
      return { ...state, guestlogin_error: '', guestlogin_loading: true };
    case GUEST_LOGIN_SUCCESS:
      return { ...state, guestlogin_loading: false };
    case GUEST_LOGIN_FAIL:
      return { ...state, guestlogin_error: p.error, guestlogin_loading: false };

    case ROBOCALL_BEGIN:
      return { ...state, robocall_error: null, robocall_loading: true };
    case ROBOCALL_SUCCESS:
      return { ...state, robocall_loading: false };
    case ROBOCALL_ERROR:
      return { ...state, robocall_error: p.error, robocall_loading: false };
    default:
      return state;
  }
};
