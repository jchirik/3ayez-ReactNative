import React from 'react';
import ImagePicker from 'react-native-image-picker';

import { connect } from 'react-redux';
import { GiftedChat, Bubble, Day, Send, Actions as GiftedActions } from 'react-native-gifted-chat'

import {
  View,
  Platform,
  Dimensions,
  Image,
  StyleSheet 
} from 'react-native';

import {
  AYEZ_GREEN,
} from '../../Helpers.js';

import {
  strings,
  FONT_REGULAR,
  FONT_MEDIUM
} from '../../i18n.js';

const VISITOR_TYPE = 'visitor';


import images from '../../theme/images'

import {
  Header,
  RTLImage
} from '../_common';


const { height, width } = Dimensions.get('window');
const totalSize = num =>
  (Math.sqrt(height * height + width * width) * num) / 100;

class Chat extends React.Component {
  constructor(props) {
    super(props);
    
  
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

  renderSend(props) {
    return (
      <Send {...props}>
        <View style={{ marginBottom: 10 }}>
          <Image
            style={{ height: 20, width: 50 }}
            source={images.chatSendIcon}
            resizeMode={'cover'}
          />
        </View>
      </Send>
    );
  }

  uploadFile = file => {
    this.props.visitorSDK
      .sendFile(
        {
          file: {
            uri: file.uri,
            type: file.type,
            name: file.fileName
          }
        }
      )
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
    return <GiftedActions icon={props => <View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><RTLImage
      style={{
        backgroundColor: 'transparent',
        width: 20,
        height: 20,
      }}
      source={images.cameraIcon}
      resizeMode={'contain'}
      /></View>} {...props} options={options} />;
  };

  

  render() {
      return (
        <View
        style={{ flex: 1, backgroundColor: '#FAFCFD'}}
      >
        <Header title={strings('SupportChat.header')} />
          <GiftedChat
            renderBubble={this.renderBubble}
            renderDay={this.renderDay}
            autoFocus
            dateFormat={'ll'}
            bottomOffset={-12}
            placeholder={strings('SupportChat.inputPlaceholder')}

            messages={this.props.messages}
            onSend={this.handleSend}
            onInputTextChanged={this.handleInputTextChange}
            user={this.getVisitor()}
            isAnimated
            
            renderSend={this.renderSend}
            renderCustomView={this.renderCustomView}
            renderActions={this.renderCustomActions}
            renderFooter={() => (<View style={{height:8}} />)}
            {...this.props}
          />
        </View>
      );
  }
}

Chat.propTypes = {
};

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

const mapStateToProps = ({ SupportChat: { support_messages_for_group: messages, send_loading, users } }, props) => {
  return {
    messages: messages[props.group],
    send_loading,
    users
  };
};

export default connect(mapStateToProps, {})(Chat);