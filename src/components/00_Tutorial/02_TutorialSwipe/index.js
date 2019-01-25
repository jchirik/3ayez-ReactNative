import React, { Component } from 'react';
import {
  View,
   Image,
   ActivityIndicator,
   TouchableOpacity,
   SectionList,
   Platform,
   BackHandler,
   AsyncStorage,
   Dimensions
 } from 'react-native';

import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  Header,
  BlockButton,
  BackButton,
  LoadingOverlay,
  RTLImage,
  AyezText
} from '../../_common';

import {
  onCompleteAuth,
  authGuestLogin
} from '../../../actions';

import {
  AYEZ_GREEN,
  STATUS_BAR_HEIGHT
} from '../../../Helpers.js';

const tutorial_1 = require('../../../../assets/images_v2/Tutorial/tutorial_1.jpg');
const tutorial_2 = require('../../../../assets/images_v2/Tutorial/tutorial_2.jpg');
const tutorial_3 = require('../../../../assets/images_v2/Tutorial/tutorial_3.jpg');

const window = Dimensions.get('window');

class TutorialSwipe extends Component {

  constructor(props) {
    super(props);
  }

  renderDotIndicator() {
    return (
      <PagerDotIndicator
        pageCount={3}
        dotStyle={{
          marginLeft: 10,
          marginRight: 10,
          height: 4,
          width: 4,
          backgroundColor: '#BBBBBB'
        }}
        selectedDotStyle={{
          marginLeft: 10,
          marginRight: 10,
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: AYEZ_GREEN
        }}
      />
    );
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>

        <IndicatorViewPager
            style={{ flex: 1, marginTop: STATUS_BAR_HEIGHT + 20 }}
            indicator={this.renderDotIndicator()}
          >
          <View style={{ flex: 1, alignItems: 'center' }}>
              <RTLImage
                source={tutorial_1}
                style={{
                  alignSelf: 'center',
                  height: window.width,
                  width: window.width
                }}
                resizeMode={'contain'}
              />
              <Text style={{
                marginTop: 20
              }}>Conveniently order online</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <RTLImage
                source={tutorial_2}
                style={{
                  alignSelf: 'center',
                  height: window.width,
                  width: window.width
                }}
                resizeMode={'contain'}
              />
              <Text style={{
                marginTop: 20
              }}>Shop easier</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <RTLImage
                source={tutorial_3}
                style={{
                  alignSelf: 'center',
                  height: window.width,
                  width: window.width
                }}
                resizeMode={'contain'}
              />
              <Text style={{
                marginTop: 20
              }}>Track your delivery in real time</Text>
            </View>
        </IndicatorViewPager>

        <BlockButton
          text={'REGISTER AS A CUSTOMER'}
          style={{
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 18,
            marginRight: 18,
            alignSelf: 'stretch'
          }}
          onPress={() => {
            // proceed to address create after auth
            this.props.onCompleteAuth(() => Actions.addressCreate())
            Actions.auth();
          }}
        />

        <TouchableOpacity
            style={{
              paddingTop: 12,
              paddingBottom: 16
            }}
            onPress={() => {
              this.props.authGuestLogin(() => Actions.addressCreate())
            }}
          >
          <AyezText bold style={{
            fontSize: 14,
            textAlign: 'center'
          }}>
            CONTINUE AS GUEST
          </AyezText>
         </TouchableOpacity>
         <BackButton fixed />
         <LoadingOverlay isVisible={this.props.guestlogin_loading} />
      </View>
    );
  }
}

const mapStateToProps = ({ Auth }) => {
  const {
    guestlogin_loading,
    guestlogin_error
  } = Auth;
  return {
    guestlogin_loading,
    guestlogin_error
  };
};

export default connect(mapStateToProps, {
  onCompleteAuth,
  authGuestLogin
})(TutorialSwipe);
