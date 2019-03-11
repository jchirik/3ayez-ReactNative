/*
CustomerData_Actions.js
*/

import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';

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
} from './types';

import ImagePicker from 'react-native-image-picker';

export const listenToChat = () => {
  return dispatch => {
    const { currentUser } = firebase.auth();
    if (currentUser.uid) {
      // .orderBy('timestamp', 'desc')
      const chatListener = firebase
        .firestore()
        .collection('chats')
        .doc(currentUser.uid)
        .onSnapshot(doc => {
          if (doc.exists) {
            const chat = { ...doc.data(), id: doc.id };
            dispatch({ type: CHAT_SET, payload: { chat } });
          }
        });
      dispatch({ type: CHAT_LISTENER_SET, payload: { chatListener } });
    }
  };
};

export const listenSupportMessages = () => {
  return dispatch => {
    const { currentUser } = firebase.auth();
    if (currentUser.uid) {
      // .orderBy('timestamp', 'desc')
      const messageListener = firebase
        .firestore()
        .collection('chats')
        .doc(currentUser.uid)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .limit(25)
        .onSnapshot(messages_t => {
          const messages = messages_t.docs.map(message => {
            return { ...message.data(), id: message.id };
          });
          dispatch({ type: SUPPORT_MESSAGES_SET, payload: { messages } });
        });
      dispatch({
        type: SUPPORT_MESSAGES_LISTENER_SET,
        payload: { messageListener }
      });
    }
  };
};

export const endListeningSupportMessages = () => {
  return dispatch => {
    dispatch({
      type: SUPPORT_MESSAGES_LISTENER_SET,
      payload: { messageListener: null }
    });
  };
};

export const setChatSeen = () => {
  return dispatch => {
    const { currentUser } = firebase.auth();
    if (currentUser.uid) {
      const update = {
        customer_unseen: false,
        phone: currentUser.phoneNumber
      };
      firebase
        .firestore()
        .collection('chats')
        .doc(currentUser.uid)
        .set(update, { merge: true });
    }
  };
};

export const onSendSupportMessage = messages => {
  return dispatch => {
    const { currentUser } = firebase.auth();
    if (currentUser.uid && messages && messages.length > 0) {
      const chatRef = firebase
        .firestore()
        .collection('chats')
        .doc(currentUser.uid)
        .collection('messages');
      var batch = firebase.firestore().batch();
      messages.forEach(message => {
        batch.set(chatRef.doc(), message);
      });
      batch.commit();
      firebase
        .firestore()
        .collection('chats')
        .doc(currentUser.uid)
        .set(
          {
            ayez_unseen: true,
            last_message: messages[messages.length - 1].text
          },
          { merge: true }
        );
    }
  };
};

export const onSendSupportImage = () => {
  return dispatch => {
    const { currentUser } = firebase.auth();
    if (!currentUser.uid) {
      return;
    }

    // 1. select image
    const options = {
      title: 'Select image to send',
      quality: 0.3,
      maxWidth: 1500,
      maxHeight: 1500,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        return;
      } else if (response.uri) {
        console.log('got image', response.uri);

        dispatch({ type: MESSAGE_SEND_BEGIN });

        const messageRef = firebase
          .firestore()
          .collection('chats')
          .doc(currentUser.uid)
          .collection('messages')
          .doc();

        console.log('uploading as', messageRef.id);

        // 2. upload the image
        const imageRef = firebase
          .storage()
          .ref('chat_images')
          .child(messageRef.id);
        imageRef
          .put(response.uri, { contentType: 'image/jpeg' }) //--> here just pass a uri
          .then(snapshot => {
            console.log(
              'succesfully uploaded, snapshot.metadata',
              snapshot.metadata
            );

            imageRef.getDownloadURL().then(image_url => {
              console.log('download url', image_url);

              // 3. save data to a new message
              messageRef
                .set({
                  _id: messageRef.id,
                  createdAt: new Date(),
                  user: {
                    _id: currentUser.uid
                  },
                  image: image_url
                })
                .then(() => {
                  dispatch({ type: MESSAGE_SEND_SUCCESS });
                });
              firebase
                .firestore()
                .collection('chats')
                .doc(currentUser.uid)
                .set(
                  {
                    ayez_unseen: true,
                    last_message: 'Image'
                  },
                  { merge: true }
                );
            });
          })
          .catch(err => {
            console.log('Error uploading image', err);
            dispatch({ type: MESSAGE_SEND_SUCCESS });
          });
      }
    });
  };
};

export const addSupportMessage = message => {
  return dispatch => {
    dispatch({
      type: ADD_GENERAL_SUPPORT_MESSAGE,
      payload: message
    });
  };
};

export const addSupportUser = user => {
  return dispatch => {
    dispatch({
      type: ADD_SUPPORT_USER,
      payload: user
    });
  };
};

export const validateMessage = (customId, uri = undefined) => {
  return dispatch => {
    dispatch({
      type: VALIDATE_SUPPORT_MESSAGE,
      payload: { customId, uri }
    });
  };
};
