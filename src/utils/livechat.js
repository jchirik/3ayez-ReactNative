import { init } from '@livechat/livechat-visitor-sdk';
import { Actions } from 'react-native-router-flux';
import { sceneKeys } from '../router';
import { toast } from '../Helpers';
import { strings } from '../i18n';

export const GIFTED_CHAT_MODEL = {
  id: '_id',
  text: 'text',
  at: 'createdAt',
  user: 'user',
  image: 'image',
  avatar: 'avatar',
  name: 'name',
  system: 'system',
  type: 'type'
};

export default class LiveChat {
  static _liveChat = undefined;
  static SUPPORT_CHAT_GENERAL_GROUP = 0;
  static TYPING_INDICATOR_EVENT = 'typing_indicator';
  static CUSTOMER_QUEUED_EVENT = 'visitor_queued';
  static NEW_MESSAGE_EVENT = 'new_message';
  static NEW_FILE_EVENT = 'new_file';
  static AGENT_CHANGED_EVENT = 'agent_changed';
  static VISITOR_DATA_EVENT = 'visitor_data';
  static CHAT_ENDED_EVENT = 'chat_ended';
  static AGENT_TYPE = 'agent';
  static VISITOR_TYPE = 'visitor';

  static getInstance(license = undefined) {
    if (LiveChat._liveChat) {
      return LiveChat._liveChat;
    }
    LiveChat._liveChat = init({ license });
    return LiveChat._liveChat;
  }

  static addSupportUserWithType = (addSupportUser, user, type) => {
    addSupportUser(
      LiveChat.getFormattedUser({
        id: user.id,
        type: type,
        name: user.name | user.type,
        avatar: user.avatarUrl ? 'https://' + user.avatarUrl : null
      })
    );
  };

  static getFormattedMessage({
    text,
    id = String(Math.random()),
    at = Date.now(),
    system = false,
    user = undefined,
    image = undefined
  }) {
    return {
      [GIFTED_CHAT_MODEL.text]: text,
      [GIFTED_CHAT_MODEL.id]: id,
      [GIFTED_CHAT_MODEL.at]: at,
      [GIFTED_CHAT_MODEL.system]: system,
      [GIFTED_CHAT_MODEL.user]: user,
      [GIFTED_CHAT_MODEL.image]: image
    };
  }

  static getFormattedUser({
    id = String(Math.random()),
    at = Date.now(),
    type = LiveChat.AGENT_TYPE,
    name = undefined,
    avatar = undefined
  }) {
    return {
      [GIFTED_CHAT_MODEL.id]: id,
      [GIFTED_CHAT_MODEL.at]: at,
      [GIFTED_CHAT_MODEL.type]: type,
      [GIFTED_CHAT_MODEL.name]: name,
      [GIFTED_CHAT_MODEL.avatar]: avatar
    };
  }

  static notifyForNewMessage() {
    if (Actions.currentScene != sceneKeys.supportChat) {
      toast(strings('Support.newMessageNotification'));
    }
  }

  static addLiveChatListeners({
    sdk,
    messages,
    users,
    addSupportUser,
    addSupportMessage,
    greetingMessage
  }) {
    sdk.on(LiveChat.TYPING_INDICATOR_EVENT, typingData => {
      if (typingData.isTyping) toast(strings('SupportChat.agentIsTyping'));
    });

    sdk.on(LiveChat.CUSTOMER_QUEUED_EVENT, _ => {
      addSupportMessage(
        LiveChat.getFormattedMessage({
          text: strings('SupportChat.pleaseWaitForAgent'),
          system: true
        })
      );
    });

    sdk.on(LiveChat.NEW_MESSAGE_EVENT, message => {
      LiveChat.notifyForNewMessage();

      if (
        users[message.authorId] &&
        users[message.authorId].type == LiveChat.VISITOR_TYPE
      )
        return;

      addSupportMessage(
        LiveChat.getFormattedMessage({
          text: message.text,
          at: message.timestamp,
          user: users[message.authorId]
        })
      );
    });

    sdk.on(LiveChat.NEW_FILE_EVENT, file => {
      LiveChat.notifyForNewMessage();
      if (
        users[file.authorId] &&
        users[file.authorId].type == LiveChat.VISITOR_TYPE
      )
        return;
      addSupportMessage(
        LiveChat.getFormattedMessage({
          image: file.url,
          user: users[file.authorId],
          at: file.timestamp
        })
      );
    });

    sdk.on(LiveChat.AGENT_CHANGED_EVENT, agent => {
      LiveChat.addSupportUserWithType(
        addSupportUser,
        agent,
        LiveChat.AGENT_TYPE
      );
    });

    sdk.on(LiveChat.VISITOR_DATA_EVENT, visitor => {
      LiveChat.addSupportUserWithType(
        addSupportUser,
        visitor,
        LiveChat.VISITOR_TYPE
      );
    });

    if (messages.length == 0) {
      addSupportMessage(
        LiveChat.getFormattedMessage({
          text: greetingMessage,
          system: true
        })
      );
    }
  }
}
