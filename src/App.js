import React, { Component } from 'react';
import { Provider } from 'react-redux';
import codePush from 'react-native-code-push';
import store, { persistor, REDUCERS_NAMES } from './reducers';
import Router from './router/root';
import { PersistGate } from 'redux-persist/integration/react';
import { View, Text, Modal, ActivityIndicator, AppState, NetInfo, Alert, Platform } from 'react-native';
import { sceneKeys } from './router';
import SplashScreen from 'react-native-splash-screen';
import { SPLASH_SCREEN_TIME_OUT, isIOS, toast, NET_INFO_STATE, CONNECTION_CHANGE_EVENT } from './Helpers';
import { strings } from './i18n';
import { Sentry } from 'react-native-sentry';
import { addSupportMessage, addSupportUser } from './actions';
import fonts from './theme/fonts';
import zendesk from './ZendeskChat/ZendeskChatNativeModule';
import {navigateBackTo} from './router/index';
import AyezText from './components/_common/AyezText';

import appsFlyer from 'react-native-appsflyer';

class App extends Component {
  constructor() {
    super();
    this.state = {
      is_updating: false,
      update_text_ar: '',
      update_text_en: '',
      progress_percent: 0.0,
      visitorSDK: undefined,
      greetingMessage: undefined,
      isSplashShown: true,
      isInternetConnected: true,
      appState: AppState.currentState
    };
  }
  componentDidMount() {
    NetInfo.addEventListener(CONNECTION_CHANGE_EVENT, this.handleConnectionChange);
    let that = this;

    codePush.getUpdateMetadata().then(update => {
      if (update) {
        Sentry.setVersion(update.appVersion + '-codepush:' + update.label);
      }
    });
    setTimeout(function() {
      that.setState({ isSplashShown: false });
    }, SPLASH_SCREEN_TIME_OUT);
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  handleConnectionChange = connectionInfo => {
    if(connectionInfo.type == NET_INFO_STATE.NONE) {
      this.setState({ isInternetConnected: false });
    } else {
      this.setState({ isInternetConnected: true });
    }
  }


  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if (Platform.OS === 'ios') {
        appsFlyer.trackAppLaunch();
      }
    }
    this.setState({appState: nextAppState});
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(CONNECTION_CHANGE_EVENT);
    zendesk.zendeskEmitter.removeAllListeners();

    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  componentWillMount() {
    if (isIOS()) {
      const chatSubscription = zendesk.zendeskEmitter.addListener(
        zendesk.RECEIVE_MESSAGE,
        this.onReceiveMsg
      );
    }

    const options = {
      devKey: "ndKGiAYYohywirYkJfhAFg"
    };
    if (isIOS()) { options.appId = "1329892544"; }
    appsFlyer.initSdk(options,
      (result) => {
        console.log(result);
      }, (error) => {
        console.error(error);
      }
    )
    if (Platform.OS === 'android') {
      appsFlyer.setCollectIMEI(true,
        (result) => {
           console.log("setCollectIMEI ...");
         });
     appsFlyer.setCollectAndroidID(true,
       (result) => {
          console.log("setCollectAndroidID ... ");
        });
      const  gcmProjectNum = "944939788978";
      appsFlyer.enableUninstallTracking(gcmProjectNum,
      (success) => {
        console.log(success)
      })
    }
  }

  onReceiveMsg = () => {
    toast(strings('SupportChat.receivedCustomerSupportMessage'));
  };

  codePushStatusDidChange(status) {
    switch (status) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log('Checking for updates.');
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log('Downloading package.');
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        console.log('Installing update.');
        this.setState({
          update_text_ar: 'تثبيت تحديث البرنامج',
          update_text_en: 'Installing update'
        });
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        console.log('Up to Date.');
        this.setState({
          is_updating: false,
          progress_percent: 0.0,
          update_text_ar: '',
          update_text_en: ''
        });
        break;
    }
  }

  codePushDownloadDidProgress(progress) {
    const progress_percent = progress.receivedBytes / progress.totalBytes;
    this.setState({
      progress_percent,
      update_text_ar: 'تحميل تحديث البرنامج',
      update_text_en: 'Preparing update'
    });
    if (progress_percent < 0.5) {
      this.setState({
        is_updating: true
      });
    }
  }

  render() {
    if (!this.state.isSplashShown) {
      SplashScreen.hide();
    }

    if (this.state.is_updating) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              fontFamily: 'FrutigerLTArabic-55Roman',
              fontSize: 16,
              color: 'black',
              marginBottom: 4
            }}
          >
            {this.state.update_text_ar}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 16,
              color: 'black',
              marginBottom: 6
            }}
          >
            {this.state.update_text_en}
          </Text>
          {this.state.progress_percent ? (
            <Text
              style={{
                fontFamily: 'FrutigerLTArabic-55Roman',
                fontSize: 16,
                color: 'black',
                marginBottom: 12
              }}
            >
              {(this.state.progress_percent * 100).toFixed(1)}%
            </Text>
          ) : null}
          <ActivityIndicator size="small" />
        </View>
      );
    }

    return (
      <Provider store={store}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={!this.state.isInternetConnected}
          onRequestClose={() => {}}>
          <View style={{backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <AyezText bold style={{marginBottom: 10}}>{strings("Common.noInternet")}</AyezText>
            <AyezText style={{ textAlign: 'center' }}>{strings("Common.pleaseConnectToInternetNetwork")}</AyezText>
          </View>
        </Modal>

        <PersistGate loading={null} persistor={persistor}>
          <Router />
        </PersistGate>
      </Provider>
    );
  }
}

const cpApp = codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE
})(App);
export default cpApp;
