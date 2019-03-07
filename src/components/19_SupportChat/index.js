import React from 'react';
import ImagePicker from 'react-native-image-picker';

import { connect } from 'react-redux';
import {
  GiftedChat,
  Bubble,
  Day,
  Send,
  Actions as GiftedActions,
  Composer,
  SystemMessage
} from 'react-native-gifted-chat';

import {
  View,
  Platform,
  Dimensions,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager
} from 'react-native';

import {
  AYEZ_GREEN,
  toast,
  isIPhoneX,
  GIFTED_CHAT_MODEL
} from '../../Helpers.js';
import { addSupportMessage } from '../../actions';

import { strings, FONT_REGULAR, FONT_MEDIUM } from '../../i18n.js';

const VISITOR_TYPE = 'visitor';

import images from '../../theme/images';

import { Header, RTLImage } from '../_common';
import { navigateBack } from '../../router/index.js';

const { height, width } = Dimensions.get('window');
const totalSize = num =>
  (Math.sqrt(height * height + width * width) * num) / 100;

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      typingText: null,
      messages: []
    };
    this.handleInputTextChange = this.handleInputTextChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  getVisitor = () => {
    const visitorId = Object.keys(this.props.users).find(
      userId => this.props.users[userId].type === VISITOR_TYPE
    );
    return this.props.users[visitorId];
  };

  handleInputTextChange = text => {
    this.props.visitorSDK.setSneakPeek({ text });
  };

  handleSend = messages => {
    this.props.visitorSDK.sendMessage({
      customId: String(Math.random()),
      text: messages[0].text
    });
  };

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
    );
  };

  renderDay = props => {
    return (
      <Day
        {...props}
        textStyle={{
          color: AYEZ_GREEN,
          fontFamily: FONT_MEDIUM(),
          fontSize: 12
        }}
        wrapperStyle={{
          borderWidth: 2,
          borderColor: '#F3F3F3',
          borderRadius: 6,
          padding: 5
        }}
      />
    );
  };

  static notifyForUploadingFile() {
    toast(strings('SupportChat.uploadingYourFile'));
  }

  uploadFile = file => {
    Chat.notifyForUploadingFile();
    this.props.visitorSDK
      .sendFile({
        file: {
          uri: file.uri,
          type: file.type,
          name: file.fileName
        }
      })
      .then(r => console.log(r))
      .catch(r => console.log(r));
  };

  renderCustomActions = props => {
    const options = {
      [strings('SupportChat.takePhoto')]: props => {
        ImagePicker.launchCamera(options, response => {
          if (response === undefined || response.uri === undefined) return;
          this.uploadFile(response);
        });
      },
      [strings('SupportChat.selectPhoto')]: props => {
        ImagePicker.launchImageLibrary(options, response => {
          if (response === undefined || response.uri === undefined) return;
          this.uploadFile(response);
        });
      },
      [strings('SupportChat.cancel')]: () => {}
    };
    return (
      <GiftedActions
        icon={props => (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <RTLImage
              style={{
                backgroundColor: 'transparent',
                width: 30,
                height: 30
              }}
              source={images.cameraIcon}
              resizeMode={'contain'}
            />
          </View>
        )}
        {...props}
        options={options}
      />
    );
  };

  onSendSupportImage = () => {
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
        console.log('got image', response);
        this.uploadFile(response);
      }
    });
  };

  renderComposer = props => {
    // if (props.text.trim().length > 0) {
    //   return (
    //     <View style={{flexDirection: 'row'}}>
    //       <Composer {...props} />
    //     </View>
    //   );
    // }

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          borderWidth: 0,
          flex: 1,
          marginBottom: isIPhoneX() ? 24 : 0
        }}
      >
        <TouchableOpacity onPress={this.onSendSupportImage}>
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
            source={images.cameraIcon}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: '#F3F3F3',
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            margin: 6,
            borderRadius: 10
          }}
        >
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
              source={images.chatSendIcon}
              resizeMode={'contain'}
            />
          </Send>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#FAFCFD' }}>
        <Header
          title={strings('SupportChat.header')}
          rightButton={{
            onPress: () => {
              this.props.visitorSDK.closeChat();
              navigateBack();
            },
            text: strings('SupportChat.closeChat'),
            image_source: images.exitIcon
          }}
        />
        <GiftedChat
          {...this.props}
          renderBubble={this.renderBubble}
          renderDay={this.renderDay}
          autoFocus
          dateFormat={'ll'}
          placeholder={strings('SupportChat.inputPlaceholder')}
          onSend={this.handleSend}
          onInputTextChanged={this.handleInputTextChange}
          renderSystemMessage={props => <SystemMessage {...props} textStyle={{
            lineHeight: 22,
            fontSize: 14,
            fontFamily: FONT_MEDIUM(),
            textAlign: 'center'
          }} wrapperStyle={{ width: '90%' }}></SystemMessage>}
          user={this.getVisitor()}
          isAnimated
          textInputProps={{
            lineHeight: 22,
            fontSize: 14,
            fontFamily: FONT_MEDIUM(),
            textAlign: I18nManager.isRTL ? 'right' : 'left'
          }}
          renderChatFooter={() => (
            <View style={{ height: isIPhoneX() ? 20 : 0 }} />
          )}
          bottomOffset={-12}
          autoFocus
          renderComposer={this.renderComposer}
          renderFooter={_ => <View style={{ height: 30 }} ></View>}
          renderSend={() => {}}
        />
      </View>
    );
  }
}

Chat.propTypes = {};

const styles = StyleSheet.create({
  hide: {
    width: 0,
    height: 0,
    position: 'absolute'
  },
  container: {
    width,
    height: Platform.OS === 'ios' ? height : height - height / 25,
    position: 'absolute',
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  navigation: {
    flex: 1
  },
  systemMessage: {
    backgroundColor: '#fff',
    alignSelf: 'center'
  },
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  footerText: {
    fontSize: 14,
    color: '#aaa'
  },
  status: {
    textAlign: 'center',
    fontSize: totalSize(2.1),
    fontWeight: '500',
    color: '#444',
    padding: 5
  }
});

const mapStateToProps = (
  {
    SupportChat: { support_messages_for_group: messages, send_loading, users }
  },
  props
) => {
  return {
    messages: messages,
    send_loading,
    users
  };
};

export default connect(
  mapStateToProps,
  {}
)(Chat);
