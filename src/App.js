import React, { Component } from 'react';
import { Provider } from 'react-redux';
// import codePush from "react-native-code-push";
import store from './reducers';
import Router from './Router';

// import { Circle } from 'react-native-progress';

import {
  View,
  Text,
  Modal,
  ActivityIndicator
} from 'react-native';


class App extends Component {

  // constructor() {
  //   super();
  //
  //   this.state = {
  //     is_updating: false,
  //     update_text: '',
  //     progress_percent: 0.0
  //   };
  // }

  // codePushStatusDidChange(status) {
  //     switch(status) {
  //         case codePush.SyncStatus.CHECKING_FOR_UPDATE:
  //             console.log("Checking for updates.");
  //             break;
  //         case codePush.SyncStatus.DOWNLOADING_PACKAGE:
  //             console.log("Downloading package.");
  //             break;
  //         case codePush.SyncStatus.INSTALLING_UPDATE:
  //             console.log("Installing update.");
  //             const installing_update_text = 'تثبيت تحديث البرنامج';
  //             this.setState({ is_updating: true, update_text: installing_update_text })
  //             break;
  //         case codePush.SyncStatus.UP_TO_DATE:
  //             console.log("Up to Date.");
  //             if (this.state.is_updating) {
  //               this.setState({ is_updating: false, progress_percent: 0.0 });
  //             }
  //             break;
  //     }
  // }
  //
  // codePushDownloadDidProgress(progress) {
  //   const progress_percent = (progress.receivedBytes/progress.totalBytes);
  //   if (progress_percent < 1) {
  //     const downloading_update_text = 'تحميل تحديث البرنامج';
  //     this.setState({ is_updating: true, update_text: downloading_update_text, progress_percent });
  //   }
  // }

  render() {

    // if (this.state.is_updating) {
    //   return (
    //     <View style={{
    //       flex: 1,
    //       justifyContent: 'center',
    //       alignItems: 'center'
    //     }}>
    //       <Text style={{
    //         fontFamily: 'BahijJanna',
    //         fontSize: 18,
    //         color: 'black'
    //       }}>{this.state.update_text}</Text>
    //       <Circle
    //         color={'#20C74B'}
    //         progress={this.state.progress_percent}
    //         indeterminate={(this.state.progress_percent === 0)}
    //         borderWidth={2}
    //         style={{ marginTop: 28 }}
    //         textStyle={{ fontFamily: 'BahijJanna' }}
    //         size={40}
    //       />
    //     </View>
    //   );
    // }

    return (
      <Provider store={store}>
          <Router />
      </Provider>
    );
  }
}

// const cpApp = codePush({ checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, installMode: codePush.InstallMode.IMMEDIATE })(App);
export default App;
