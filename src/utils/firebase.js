import firebase from 'react-native-firebase';

if (__DEV__) {
  firebase.config().enableDeveloperMode();
}

export default class Firebase {
  static LIVE_CHAT_LICENSE = 'live_chat_license';
  static GREETING_MESSAGE = 'greeting_message';
  static GET_LIVE_CHAT_CUSTOMER_INFO = 'getLiveChatCustomerInfo';
 

  static getRemoteConfig = property => {
    return new Promise(resolve => {
      firebase
        .config()
        .fetch()
        .then(() => firebase.config().activateFetched())
        .then(() => {
          firebase
            .config()
            .getValue(property)
            .then(data => {
              resolve(data.val());
            });
        })
        .catch(error => console.log(`Error processing config: ${error}`));
    });
  };

  static getLiveChatCustomerInfo = firebase
    .functions()
    .httpsCallable(Firebase.GET_LIVE_CHAT_CUSTOMER_INFO);
}
