//  Created by react-native-create-bridge

import { NativeModules } from 'react-native';

const { ZendeskChat } = NativeModules;

export default {
  start(params) {
    return ZendeskChat.start(params);
  },

  ZENDESK_URL: ZendeskChat.ZENDESK_URL,
  APPLICATION_ID: ZendeskChat.APPLICATION_ID,
  OAUTH_CLIENT_ID: ZendeskChat.OAUTH_CLIENT_ID,
  ZOPIM_ACCOUNT_KEY: ZendeskChat.ZOPIM_ACCOUNT_KEY,
  VISITOR_NAME: ZendeskChat.VISITOR_NAME,
  VISITOR_PHONE_NUMBER: ZendeskChat.VISITOR_PHONE_NUMBER,
  VISITOR_EMAIL: ZendeskChat.VISITOR_EMAIL,
  VISITOR_NOTE: ZendeskChat.VISITOR_NOTE,
}