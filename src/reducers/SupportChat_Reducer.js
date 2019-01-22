import {
  SUPPORT_MESSAGES_SET,
  SUPPORT_MESSAGES_LISTENER_SET,
  CHAT_SET,
  CHAT_LISTENER_SET,

  MESSAGE_SEND_BEGIN,
  MESSAGE_SEND_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  messages: [],
  messageListener: null,
  chat: {},
  chatListener: null,

  send_loading: false
};

export default (state = INITIAL_STATE, action) => {
  const p = action.payload;
  switch (action.type) {
    case SUPPORT_MESSAGES_SET:
      return { ...state, messages: p.messages };
    case SUPPORT_MESSAGES_LISTENER_SET:
      if (state.messageListener !== null) { state.messageListener(); }
      return { ...INITIAL_STATE, messageListener: p.messageListener };
    case CHAT_SET:
      return { ...state, chat: p.chat };
    case CHAT_LISTENER_SET:
      if (state.chatListener !== null) { state.chatListener(); }
      return { ...INITIAL_STATE, chatListener: p.chatListener };
    case MESSAGE_SEND_BEGIN:
      return { ...state, send_loading: true };
    case MESSAGE_SEND_SUCCESS:
      return { ...state, send_loading: false };
    default:
      return state;
  }
};
