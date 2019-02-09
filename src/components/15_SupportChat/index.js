import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { GiftedChat, Bubble, Day, Composer, Send, InputToolbar } from 'react-native-gifted-chat'
import firebase from 'react-native-firebase';

import {
  View,
  Modal,
  SectionList,
  Platform,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
  Image,
  BackHandler,
  AsyncStorage,
  I18nManager
} from 'react-native';

import {
  onSendSupportMessage,
  onSendSupportImage,
  listenSupportMessages,
  endListeningSupportMessages,
  setChatSeen
} from '../../actions';

import {
  AYEZ_GREEN
} from '../../Helpers.js';

import {
  strings,
  translate,
  FONT_REGULAR,
  FONT_MEDIUM
} from '../../i18n.js';

const cameraIcon = require('../../../assets/images_v2/Support/camera.png');
const chatSendIcon = require('../../../assets/images_v2/Support/chat_send.png');

import {
  Header,
  LoadingOverlay,
  RTLImage
} from '../_common';

// a big comoonent
class SupportChat extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('componentDidMount')
    this.props.listenSupportMessages();
    this.props.setChatSeen();
  }

  componentWillUnmount() {
    // this.props.endListeningSupportMessages();
    // might as well let it run. occasionally async triggers, which causes issues
    console.log('unmounting')
    this.props.setChatSeen();
  }

  renderBubble = props => {
    // let username = props.currentMessage.user.name
    // let color = this.getColor(username)

    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: 'white',
            fontFamily: FONT_REGULAR()
          },
          left: {
            color: '#464646',
            fontFamily: FONT_REGULAR()
          }
        }}
        wrapperStyle={{
          right: {
            backgroundColor: AYEZ_GREEN,
            padding: 5
          },
          left: {
            backgroundColor: '#F3F3F3',
            padding: 5
          }
        }}
      />
    )
  }

  renderDay = props => {
    return (
      <Day
        {...props}
        textStyle={{
          color: AYEZ_GREEN,
          fontFamily: FONT_MEDIUM(),
          fontSize: 12,
        }}
        wrapperStyle={{
          borderWidth: 2,
          borderColor: '#F3F3F3',
          borderRadius: 6,
          padding: 5
        }}
      />
    )
  }


  renderInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: 'white',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2},
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }} />
    )
  }

  renderComposer = props => {

    // if (props.text.trim().length > 0) {
    //   return (
    //     <View style={{flexDirection: 'row'}}>
    //       <Composer {...props} />
    //     </View>
    //   );
    // }

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderWidth: 0,
        flex: 1
      }}>

        <TouchableOpacity
          onPress={() => this.props.onSendSupportImage()}
        >
          <RTLImage
            style={{
              backgroundColor: 'transparent',
              width: 32,
              height: 32,
              marginBottom: 12,
              marginTop: 8,
              marginRight: 3,
              marginLeft: 10
            }}
            source={cameraIcon}
            resizeMode={'contain'}
            />
        </TouchableOpacity>
        <View style={{
          backgroundColor: '#F3F3F3',
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-end',
          margin: 6,
          borderRadius: 10
        }}>
          <Composer {...props} />
          <Send {...props} containerStyle={{ backgroundColor: 'transparent' }}>
            <RTLImage
              style={{
                backgroundColor: 'transparent',
                width: 38,
                height: 38,
                marginBottom: 3,
                marginRight: 3,
                marginLeft: 6
              }}
              source={chatSendIcon}
              resizeMode={'contain'}
              />
          </Send>
        </View>
      </View>
    );
  }




    // <View style={{marginRight: 10, marginBottom: 5}}>
    //     <Image source={require('../../assets/send.png')} resizeMode={'center'}/>
    // </View>










  render() {

    // // no device ID retrieved, loading...
    // if (!this.state.device_id) {
    //   return (
    //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //       <Circle
    //         color={'#20C74B'}
    //         indeterminate
    //         borderWidth={2}
    //         size={40}
    //       />
    //     </View>
    //   )
    // }

    const { currentUser } = firebase.auth();

    if (!currentUser.uid) {
      return null;
    }

    return (
      <View
        style={{ flex: 1, backgroundColor: '#FAFCFD'}}
      >
        <Header title={strings('SupportChat.header')} />
        <GiftedChat
          messages={this.props.messages}
          onSend={messages => this.props.onSendSupportMessage(messages)}
          user={{ _id: currentUser.uid }}
          renderBubble={this.renderBubble}
          renderDay={this.renderDay}
          renderFooter={() => (<View style={{height:8}} />)}
          renderComposer={this.renderComposer}
          renderSend={() => null}
          renderAvatar={null}
          renderInputToolbar={this.renderInputToolbar}
          textInputProps={{
            lineHeight: 22,
            fontSize: 14,
            fontFamily: FONT_MEDIUM(),
            textAlign: I18nManager.isRTL ? 'right' : 'left'
          }}
          bottomOffset={-12}
          dateFormat={'ll'}
          placeholder={strings('SupportChat.inputPlaceholder')}
        />
        <LoadingOverlay isVisible={this.props.send_loading} />
      </View>
    );
  }

}




const mapStateToProps = ({ SupportChat, CurrentSeller }) => {

  const seller = CurrentSeller;
  const { messages, send_loading } = SupportChat;

  return {
    seller,
    messages,
    send_loading
  };
};

export default connect(mapStateToProps, {
  onSendSupportMessage,
  onSendSupportImage,
  listenSupportMessages,
  endListeningSupportMessages,
  setChatSeen
})(SupportChat);
