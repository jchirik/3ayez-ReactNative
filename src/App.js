import React, { Component } from 'react';
import { Provider } from 'react-redux';
import codePush from 'react-native-code-push';
import store, { persistor, REDUCERS_NAMES } from './reducers';
import Router from './router/root';
import { PersistGate } from 'redux-persist/integration/react';
import LiveChat from '../src/utils/livechat';

import { View, Text, Modal, ActivityIndicator, AppState } from 'react-native';
import { APP_STATE_CHANGE, BACKGROUND_APP_STATE } from './utils/appstate';
import Firebase from './utils/firebase';
import { sceneKeys } from './router';
import SplashScreen from 'react-native-splash-screen';
import { SPLASH_SCREEN_TIME_OUT, isIOS } from './Helpers';
import { strings } from './i18n';
import { addSupportMessage, addSupportUser } from './actions';

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
      isSplashShown: true
    };
  }

  setupLiveChat = async () => {
    try {
      const license = await Firebase.getRemoteConfig(
        Firebase.LIVE_CHAT_LICENSE
      );
      let greeting = await Firebase.getRemoteConfig(Firebase.GREETING_MESSAGE);
      if (!greeting) greeting = strings('SupportChat.defaultGreetingMessage');
      
      const { data: customerInfo } = await Firebase.getLiveChatCustomerInfo({
        phone: this.props.customer ? this.props.customer.phone : ''
      });

      const currentVisitorSDK = await LiveChat.getInstance(license);

      LiveChat.addLiveChatListeners({
        sdk: currentVisitorSDK,
        messages: store.getState()[REDUCERS_NAMES.SupportChat].support_messages_for_group,
        users: store.getState()[REDUCERS_NAMES.SupportChat].users,
        addSupportMessage: message => store.dispatch(addSupportMessage(message)),
        addSupportUser: user => store.dispatch(addSupportUser(user)),
        greetingMessage: greeting
      });

      currentVisitorSDK.setVisitorData({
        ...customerInfo,
        customProperties: {
          customerId: customer.id
        }
      });
    } catch (e) { console.log(e) }
  }

  componentDidMount() {
    let that = this;
    setTimeout(function(){that.setState({ isSplashShown: false })}, SPLASH_SCREEN_TIME_OUT);
  }

  async componentWillUnmount() {
    AppState.removeEventListener(APP_STATE_CHANGE, this.onAppState);
  }

  async componentWillMount() {
    AppState.addEventListener(APP_STATE_CHANGE, this.onAppState);

    await this.setupLiveChat();
  }

  onAppState = nextState => {
    if (isIOS() && nextState == BACKGROUND_APP_STATE && LiveChat.getInstance()) {
      LiveChat.getInstance().closeChat();
    }
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
          is_updating: true,
          update_text_ar: 'تثبيت تحديث البرنامج',
          update_text_en: 'Installing update'
        });
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        console.log('Up to Date.');
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
    const progress_percent = progress.receivedBytes / progress.totalBytes;
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
              fontFamily: 'Cairo-Regular',
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
                fontFamily: 'Cairo-Regular',
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
