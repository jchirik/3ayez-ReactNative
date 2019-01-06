/*
CustomerData_Actions.js
*/

import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';

import {
  SUPPORT_MESSAGES_SET,
  SUPPORT_MESSAGES_LISTENER_SET,
  CHAT_SET,
  CHAT_LISTENER_SET
} from './types';

export const listenToChat = (deviceID) => {
  return (dispatch) => {
    if (deviceID) {
      // .orderBy('timestamp', 'desc')
      const chatListener = firebase.firestore().collection('chats').doc(deviceID)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const chat = { ...doc.data(), id: doc.id };
            dispatch({ type: CHAT_SET, payload: { chat } });
          }
      });
      dispatch({ type: CHAT_LISTENER_SET, payload: { chatListener } });
    }
  };
};

export const listenSupportMessages = (deviceID) => {
  return (dispatch) => {
    if (deviceID) {
      // .orderBy('timestamp', 'desc')
      const messageListener = firebase.firestore().collection('chats').doc(deviceID).collection('messages')
        .orderBy('createdAt', 'desc')
        .limit(25)
        .onSnapshot((messages_t) => {
          const messages = messages_t.docs.map(message => {
            return ({ ...message.data(), id: message.id });
          });
          dispatch({ type: SUPPORT_MESSAGES_SET, payload: { messages } });
      });
      dispatch({ type: SUPPORT_MESSAGES_LISTENER_SET, payload: { messageListener } });
    }
  };
};


export const setChatSeen = (deviceID) => {
  return (dispatch) => {
    if (deviceID) {

      const update = { customer_unseen: false };

      const { currentUser } = firebase.auth();
      if (currentUser) {
        update['customer_id'] = currentUser.uid;
        if (currentUser.phoneNumber) {
          update['phone'] = currentUser.phoneNumber;
        }
      }

      firebase.firestore().collection('chats').doc(deviceID).set(update, {merge: true});
    }
  };
};

export const onSendSupportMessage = (messages, deviceID) => {
  return (dispatch) => {
    if (deviceID && messages && messages.length > 0) {
      const chatRef = firebase.firestore().collection('chats').doc(deviceID).collection('messages')

      var batch = firebase.firestore().batch();
      messages.forEach(message => {
        batch.set(chatRef.doc(), message);
      })
      batch.commit();
      firebase.firestore().collection('chats').doc(deviceID).set({
        ayez_unseen: true, last_message: messages[messages.length - 1].text
      }, {merge: true});

    }
  };
};
