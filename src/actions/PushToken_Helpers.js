
import firebase from 'react-native-firebase';

// HELPER function for setPushToken
const uploadPushToken = (ref) => {
  firebase.messaging().getToken().then(push_token => {
    // stores the token in the user's document
    console.log('uploadPushToken', push_token, ref);
    ref.set({ push_token }, { merge: true });
  });
}

// assigns push token for device AND customer docs
export const setPushToken = (ref) => {
  firebase.messaging().hasPermission().then(enabled => {
    if (enabled) {
      // user has permissions
      console.log('setPushToken push already enabled');
      uploadPushToken(ref);
    } else {
      // user doesn't have permission
      console.log('setPushToken push not enabled');
      firebase.messaging().requestPermission().then(() => {
        console.log('setPushToken push enabled');
        setTimeout(() => uploadPushToken(ref), 3000);
      });
    }
  });
};




// const batch = firebase.firestore().batch();
// const chatRef = firebase.firestore().collection('chats').doc(deviceID);
// batch.update(chatRef, { push_token });
//
// const { currentUser } = firebase.auth();
// if (currentUser) {
//   const customerRef = firebase.firestore().collection('customers').doc(currentUser.uid);
//   batch.update(customerRef, { push_token });
// }
// batch.commit();
