//  Created by react-native-create-bridge

import { NativeEventEmitter, NativeModules } from 'react-native';

const { ZendeskChat } = NativeModules;
const zendeskEmitter = new NativeEventEmitter(ZendeskChat);

export default {
  start(params) {
    return ZendeskChat.start(params);
  },
  zendeskEmitter,
  ZENDESK_URL: ZendeskChat.ZENDESK_URL,
  APPLICATION_ID: ZendeskChat.APPLICATION_ID,
  OAUTH_CLIENT_ID: ZendeskChat.OAUTH_CLIENT_ID,
  ZOPIM_ACCOUNT_KEY: ZendeskChat.ZOPIM_ACCOUNT_KEY,
  VISITOR_NAME: ZendeskChat.VISITOR_NAME,
  VISITOR_PHONE_NUMBER: ZendeskChat.VISITOR_PHONE_NUMBER,
  VISITOR_EMAIL: ZendeskChat.VISITOR_EMAIL,
  VISITOR_NOTE: ZendeskChat.VISITOR_NOTE,
  RECEIVE_MESSAGE: ZendeskChat.RECEIVE_MESSAGE
};
