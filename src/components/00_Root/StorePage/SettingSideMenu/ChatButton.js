import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { View, TouchableOpacity } from 'react-native';
import { RTLImage, AyezText } from '../../../_common';
import { strings } from '../../../../i18n.js';
import {
  loadSupportManual,
  addSupportMessage,
  addSupportUser
} from '../../../../actions';
import images from '../../../../theme/images';
import { sceneKeys, navigateTo } from '../../../../router';
import { AYEZ_GREEN } from '../../../../Helpers';
import Firebase from '../../../../utils/firebase';
import LiveChat from '../../../../utils/livechat';

class ChatButton extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.setState({
      visitorSDK: LiveChat.getInstance()
    });
  }

  render() {
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
              color: AYEZ_GREEN,
              fontSize: 11
            }}
          >
            {strings('Support.contact3ayez')}
          </AyezText>
          <AyezText
            medium
            style={{
              fontSize: 22,
              marginBottom: 10
            }}
          >
            {strings('Support.chatWithUs')}
          </AyezText>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: AYEZ_GREEN,
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
      </TouchableOpacity>
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
    shadowColor: '#000',
    shadowOffset: { width: -1, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20
  }
};

const mapStateToProps = ({
  SupportManual,
  Customer,
  SupportChat: { support_messages_for_group: messages, send_loading, users }
}) => {
  const { manual } = SupportManual;
  return {
    manual,
    users,
    customer: Customer,
    messages
  };
};

export default connect(
  mapStateToProps,
  {
    loadSupportManual,
    addSupportMessage,
    addSupportUser
  }
)(ChatButton);
