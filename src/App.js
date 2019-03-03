import React, { Component } from 'react';
import { Provider } from 'react-redux';
import codePush from "react-native-code-push";
import store, { persistor } from './reducers';
import Router from './Router';
import { PersistGate } from 'redux-persist/integration/react'

import {
  View,
  Text,
  Modal,
  ActivityIndicator
} from 'react-native';

class App extends Component {

  constructor() {
    super();
    this.state = {
      is_updating: false,
      update_text_ar: '',
      update_text_en: '',
      progress_percent: 0.0
    };
  }

  codePushStatusDidChange(status) {
      switch(status) {
          case codePush.SyncStatus.CHECKING_FOR_UPDATE:
              console.log("Checking for updates.");
              break;
          case codePush.SyncStatus.DOWNLOADING_PACKAGE:
              console.log("Downloading package.");
              break;
          case codePush.SyncStatus.INSTALLING_UPDATE:
              console.log("Installing update.");
              this.setState({
                is_updating: true,
                update_text_ar: 'تثبيت تحديث البرنامج',
                update_text_en: 'Installing update'
              });
              break;
          case codePush.SyncStatus.UP_TO_DATE:
              console.log("Up to Date.");
              if (this.state.is_updating) {
                this.setState({
                  is_updating: false,
                  progress_percent: 0.0,
                  update_text_ar: '',
                  update_text_en: ''
                });
              }
              break;
      }
  }

  codePushDownloadDidProgress(progress) {
    const progress_percent = (progress.receivedBytes/progress.totalBytes);
    if (progress_percent <= 0.9) {
      this.setState({
        is_updating: true,
        progress_percent,
        update_text_ar: 'تحميل تحديث البرنامج',
        update_text_en: 'Preparing update'
      });
    }
  }

  render() {
    if (this.state.is_updating) {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{
            fontFamily: 'Cairo-Regular',
            fontSize: 16,
            color: 'black',
            marginBottom: 4
          }}>{this.state.update_text_ar}</Text>
          <Text style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 16,
            color: 'black',
            marginBottom: 6
          }}>{this.state.update_text_en}</Text>
          {(this.state.progress_percent) ? (
            <Text style={{
              fontFamily: 'Cairo-Regular',
              fontSize: 16,
              color: 'black',
              marginBottom: 12
            }}>{(this.state.progress_percent*100).toFixed(1)}%</Text>
          ) : null}
          <ActivityIndicator size="small" />
        </View>
      );
    }

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router />
        </PersistGate>
      </Provider>
    );
  }
}

const cpApp = codePush({ checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, installMode: codePush.InstallMode.IMMEDIATE })(App);
export default cpApp;
