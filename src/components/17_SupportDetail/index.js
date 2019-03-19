import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import zendesk from '../../../../ZendeskChat/ZendeskChatNativeModule';

import {
  View,
  Modal,
  ScrollView,
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
  AsyncStorage
} from 'react-native';

import {
  Header,
  BackButton,
  BlockButton,
  AyezText
} from '../_common';

import {
  strings,
  translate
} from '../../i18n.js';
import { sceneKeys, navigateTo } from '../../router';

// a big comoonent
class SupportDetail extends Component {
  render() {
    const { title, description } = this.props.data;
    return (
      <View
        style={{ flex: 1, backgroundColor: 'white'}}
      >
        <ScrollView style={{
          flex: 1,
          marginHorizontal: 40,
          paddingTop: 80,
          paddingBottom: 50,
        }}
          contentContainerStyle={{
            alignItems: 'flex-start',
          }}
        >
          <AyezText bold size={24} style={{
            marginBottom: 20,
            textAlign: 'left'
          }}>{translate(title)}</AyezText>
          <AyezText regular style={{
            textAlign: 'left'
          }}>{translate(description)}</AyezText>
          <BlockButton
            onPress={() => {
              zendesk.start({
                [zendesk.ZOPIM_ACCOUNT_KEY]: ZOPIM_ACCOUNT_KEY,
                [zendesk.VISITOR_NAME]: this.props.name || 'Client',
                [zendesk.VISITOR_PHONE_NUMBER]: this.props.phone || ''
              });
            }}
            text={strings('OrderProblem.contactSupport')}
            style={{
              marginTop: 20,
              alignSelf: 'stretch'
            }}
          />
        </ScrollView>
        <BackButton fixed />
      </View>
    );
  }

}


export default connect(null, {
})(SupportDetail);
