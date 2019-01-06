import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat'
import firebase from 'react-native-firebase';

import {
  View,
  Modal,
  SectionList,
  Text,
  Platform,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
  Image,
  BackHandler,
  AsyncStorage
} from 'react-native';

import {
  onSendSupportMessage,
  listenSupportMessages,
  setPushToken,
  setChatSeen
} from '../../actions';
import { strings, statusBarMargin } from '../../Helpers.js';

// a big comoonent
class SupportChat extends Component {

  constructor(props) {
    super(props);

    this.state = {
      device_id: null
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);

    // should ALWAYS listen to these messages (not only on this page...)

    this.setState({ device_id });
    this.props.listenSupportMessages(device_id);
    this.props.setDevicePushToken(device_id);
    this.props.setChatSeen(device_id);

  }


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);

    if (this.state.device_id) {
      this.props.setChatSeen(this.state.device_id);
    }
  }

  onAndroidBackPress = () => {
    Actions.pop(); // Android back press
    return true;
  }

  render() {

    // no device ID retrieved, loading...
    if (!this.state.device_id) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Circle
            color={'#20C74B'}
            indeterminate
            borderWidth={2}
            size={40}
          />
        </View>
      )
    }

    return (
      <View
        style={{ flex: 1, backgroundColor: 'white'}}
      >
        <Header title={strings('Settings.contactUs')} />
        <GiftedChat
          messages={this.props.messages}
          onSend={messages => this.props.onSendSupportMessage(messages, this.state.device_id)}
          user={{
            _id: this.state.device_id
          }}
          renderAvatar={null}
          placeholder={'Send a message...'}
        />
      </View>
    );
  }

}




const mapStateToProps = ({ SupportChat, CurrentSeller }) => {

  const seller = CurrentSeller;
  const { messages } = SupportChat;

  return {
    seller,
    messages
  };
};

export default connect(mapStateToProps, {
  onSendSupportMessage,
  listenSupportMessages,
  setDevicePushToken,
  setChatSeen
})(SupportChat);
