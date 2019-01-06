import {
  SUPPORT_MESSAGES_SET,
  SUPPORT_MESSAGES_LISTENER_SET,
  CHAT_SET,
  CHAT_LISTENER_SET
} from '../actions/types';

const INITIAL_STATE = {
  messages: [],
  messageListener: null,
  chat: {},
  chatListener: null
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
    default:
      return state;
  }
};
