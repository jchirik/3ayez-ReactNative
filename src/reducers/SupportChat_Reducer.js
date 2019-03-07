import {
  SUPPORT_MESSAGES_SET,
  SUPPORT_MESSAGES_LISTENER_SET,
  CHAT_SET,
  CHAT_LISTENER_SET,

  MESSAGE_SEND_BEGIN,
  MESSAGE_SEND_SUCCESS,
  ADD_GENERAL_SUPPORT_MESSAGE,
  ADD_SUPPORT_USER,
  VALIDATE_SUPPORT_MESSAGE
} from '../actions/types';

const INITIAL_STATE = {
  support_messages_for_group: [],
  users: { system: {
    name: 'system',
    _id: 'system'
  } },
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
    case ADD_GENERAL_SUPPORT_MESSAGE:
      let { support_messages_for_group } = state
      support_messages_for_group = [p].concat(support_messages_for_group)
      return { ...state, support_messages_for_group }
    case VALIDATE_SUPPORT_MESSAGE:
      const customId = p
      let { support_messages_for_group: to_be_validated } = state
      const to_be_validated_index = to_be_validated.findIndex(message => {
        return (message._id + "") == (customId + "");
      });
      to_be_validated[to_be_validated_index].received = true;
      to_be_validated[to_be_validated_index].sent = true;
      return {...state, support_messages_for_group: [].concat(to_be_validated)};
    case ADD_SUPPORT_USER:
      users = state.users
      Object.keys(users).forEach(currentUser => {
      })
      users[p._id] = p   
      return { ...state, users }
    default:
      return state;
  }
};
