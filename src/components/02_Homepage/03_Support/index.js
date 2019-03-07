import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { View, FlatList, TouchableOpacity, Image, AppState, ActivityIndicator } from 'react-native';
import firebase from 'react-native-firebase';
import { init } from '@livechat/livechat-visitor-sdk';
import { RTLImage, AyezText } from '../../_common';
import { strings, translate } from '../../../i18n.js';
import {
  loadSupportManual,
  addSupportMessage,
  addSupportUser
} from '../../../actions';
import images from '../../../theme/images';
import { sceneKeys, navigateTo } from '../../../router';
import { toast } from '../../../Helpers';

const SUPPORT_CHAT_GENERAL_GROUP = 0;
const GET_LIVE_CHAT_CUSTOMER_INFO = 'getLiveChatCustomerInfo';
const NEW_MESSAGE_EVENT = 'new_message';
const NEW_FILE_EVENT = 'new_file';
const AGENT_CHANGED_EVENT = 'agent_changed';
const VISITOR_DATA_EVENT = 'visitor_data';
const CHAT_ENDED_EVENT = 'chat_ended';
const AGENT_TYPE = 'agent';
const VISITOR_TYPE = 'visitor';
const LIVE_CHAT_REMOTE_CONFIG_LICENSE = 'live_chat_license';
const GIFTED_CHAT_MODEL = {
  id: '_id',
  text: 'text',
  at: 'createdAt',
  user: 'user',
  image: 'image',
  avatar: 'avatar',
  name: 'name',
  system: 'system',
  type: 'type'
};

const getLiveChatCustomerInfo = firebase
  .functions()
  .httpsCallable(GET_LIVE_CHAT_CUSTOMER_INFO);

if (__DEV__) {
  firebase.config().enableDeveloperMode();
}

class Support extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visitorSDK: undefined
    }
  }

  static notifyForNewMessage() {
    if (Actions.currentScene != sceneKeys.supportChat) {
      toast(strings('Support.newMessageNotification'))
    }
  }

  static retrieveComponentProps = property => {
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

  setUpVisitorSDKWithGroup = (customer, license) => {
    let currentVisitorSDK = init({
      license: license,
      group: 0
    });

    this.listenForNewMessagesFor(currentVisitorSDK);
    this.listenForNewFilesFor(currentVisitorSDK);
    this.listenForChatEndedFor(currentVisitorSDK);
    this.listenForNewAgentFor(currentVisitorSDK);
    this.listenForNewVisitorFor(currentVisitorSDK);

    currentVisitorSDK.setVisitorData({
      ...customer,
      customProperties: {
        customerId: customer.id
      }
    });

    this.setState({
      visitorSDK: currentVisitorSDK
    });
  };

  listenForNewMessagesFor = (sdk, group) => {
    sdk.on(NEW_MESSAGE_EVENT, message => {
      Support.notifyForNewMessage()

      this.props.addSupportMessage({
          [GIFTED_CHAT_MODEL.text]: message.text,
          [GIFTED_CHAT_MODEL.id]: message.id + String(Math.random()),
          [GIFTED_CHAT_MODEL.at]: message.timestamp,
          [GIFTED_CHAT_MODEL.user]: this.props.users[message.authorId]
      });
    });
  };

  listenForNewFilesFor = (sdk, group) => {
    sdk.on(NEW_FILE_EVENT, file => {
      Support.notifyForNewMessage()
      this.props.addSupportMessage({
          [GIFTED_CHAT_MODEL.id]: file.id + String(Math.random()),
          [GIFTED_CHAT_MODEL.at]: file.timestamp,
          [GIFTED_CHAT_MODEL.user]: this.props.users[file.authorId],
          [GIFTED_CHAT_MODEL.image]: file.url
      });
    });
  };

  listenForNewAgentFor = sdk => {
    sdk.on(AGENT_CHANGED_EVENT, agent => {
      this.addSupportUserWithType(agent, AGENT_TYPE);
    });
  };

  listenForNewVisitorFor = sdk => {
    sdk.on(VISITOR_DATA_EVENT, visitor => {
      this.addSupportUserWithType(visitor, VISITOR_TYPE);
    });
  };

  addSupportUserWithType = (user, type) => {
    this.props.addSupportUser({
      [GIFTED_CHAT_MODEL.id]: user.id,
      [GIFTED_CHAT_MODEL.type]: type,
      [GIFTED_CHAT_MODEL.name]: user.name || user.type,
      [GIFTED_CHAT_MODEL.avatar]: user.avatarUrl
        ? 'https://' + user.avatarUrl
        : null
    });
  };

  listenForChatEndedFor = (sdk, group) => {
    sdk.on(CHAT_ENDED_EVENT, () => {
      Support.notifyForNewMessage()
      this.props.addSupportMessage({
          [GIFTED_CHAT_MODEL.text]: strings('SupportChat.chatEnded'),
          [GIFTED_CHAT_MODEL.id]: String(Math.random()),
          [GIFTED_CHAT_MODEL.at]: Date.now(),
          [GIFTED_CHAT_MODEL.system]: true
      });
    });
  };

  async componentDidMount() {
    this.props.loadSupportManual();

    const license = await Support.retrieveComponentProps(
      LIVE_CHAT_REMOTE_CONFIG_LICENSE
    );

    const { data: customerInfo } = await getLiveChatCustomerInfo({
      phone: this.props.customer ? this.props.customer.phone : ''
    });

    this.setUpVisitorSDKWithGroup(customerInfo, license);
  }

  renderChatTile() {
    return (
      <TouchableOpacity
        style={styles.tileStyle}
        onPress={() => {
          if (this.state.visitorSDK) {
            navigateTo(sceneKeys.supportChat, {
              visitorSDK: this.state.visitorSDK
            });
          }
        }}
      >
        <View
          style={{
            flex: 1,
            alignSelf: 'stretch',
            alignItems: 'flex-start',
            paddingTop: 18,
            paddingBottom: 10,
            paddingLeft: 13
          }}
        >
          <AyezText
            semibold
            style={{
              color: '#2DD38F',
              fontSize: 11
            }}
          >
            {strings('Support.contact3ayez')}
          </AyezText>
          <AyezText
            medium
            style={{
              fontSize: 22
            }}
          >
            {strings('Support.chatWithUs')}
          </AyezText>
          <View style={{ flex: 1 }} />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#2DD38F',
              paddingTop: 4,
              paddingBottom: 4,
              paddingLeft: 20,
              paddingRight: 16,
              borderRadius: 8
            }}
          >
            <AyezText
              semibold
              style={{
                color: 'white',
                fontSize: 10
              }}
            >
              {strings('Support.start')}
            </AyezText>
            <RTLImage
              source={images.supportStartSideArrow}
              style={{
                width: 10,
                height: 10,
                marginLeft: 12,
                tintColor: 'white'
              }}
              resizeMode={'contain'}
            />
          </View>
        </View>

        <Image
          source={images.supportTile}
          style={{
            width: 160,
            height: 120
          }}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    );
  }

  renderSettingsButton() {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 7,
          right: 10,
          padding: 10,
          alignItems: 'center'
        }}
        onPress={() => navigateTo(sceneKeys.settings)}
      >
        <RTLImage
          source={images.supportSilhouetteIcon}
          style={{
            width: 30,
            height: 30,
            tintColor: '#0094ff'
          }}
          resizeMode={'contain'}
        />
        <AyezText
          semibold
          style={{
            color: '#0094ff',
            fontSize: 10
          }}
        >
          {strings('Support.settings')}
        </AyezText>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <AyezText
          bold
          style={{
            marginLeft: 4,
            fontSize: 32,
            padding: 16,
            alignSelf: 'flex-start'
          }}
        >
          {strings('Support.header')}
        </AyezText>
        {
          this.state.visitorSDK ? <FlatList
          style={{ flex: 1 }}
          removeClippedSubviews
          ListHeaderComponent={this.renderChatTile()}
          ListFooterComponent={null}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}`}
        /> : <ActivityIndicator></ActivityIndicator>
        }
        

        {this.renderSettingsButton()}
      </View>
    );
  }
}

const styles = {
  tileStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 16,
    marginRight: 16,

    shadowColor: '#000',
    shadowOffset: { width: -1, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  }
};

const mapStateToProps = ({
  SupportManual,
  Customer,
  SupportChat: { users }
}) => {
  const { manual } = SupportManual;
  return {
    manual,
    users,
    customer: Customer
  };
};

export default connect(
  mapStateToProps,
  {
    loadSupportManual,
    addSupportMessage,
    addSupportUser
  }
)(Support);
