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
  BlockUnderButton,
  BackButton,
  LoadingOverlay,
  RTLImage,
  AyezText
} from '../../_common';

import {
  onCompleteAuth,
  addressCreateProceedCheck,
  authGuestLogin
} from '../../../actions';

import {
  AYEZ_GREEN,
  STATUS_BAR_HEIGHT
} from '../../../Helpers.js';

import {
  strings,
  translate
} from '../../../i18n.js';

const tutorial_1_en = require('../../../../assets/images_v2/Tutorial/tutorial_1_en.png');
const tutorial_1_ar = require('../../../../assets/images_v2/Tutorial/tutorial_1_ar.png');
const tutorial_2 = require('../../../../assets/images_v2/Tutorial/tutorial_2.png');
const tutorial_3 = require('../../../../assets/images_v2/Tutorial/tutorial_3.png');

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

    let tutorial_1 = tutorial_1_en;
    if (this.props.locale === 'ar') {
      tutorial_1 = tutorial_1_ar;
    }

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
              <AyezText semibold size={18} style={{
                marginTop: 20
              }}>{strings('Tutorial.t1header')}</AyezText>
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
              <AyezText semibold size={18} style={{
                marginTop: 20
              }}>{strings('Tutorial.t2header')}</AyezText>
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
              <AyezText semibold size={18} style={{
                marginTop: 20
              }}>{strings('Tutorial.t3header')}</AyezText>
            </View>
        </IndicatorViewPager>

        <BlockButton
          text={strings('Tutorial.registerCustomer')}
          style={{
            marginTop: 10,
            marginLeft: 18,
            marginRight: 18,
            alignSelf: 'stretch'
          }}
          onPress={() => {
            // proceed to address create after auth
            this.props.onCompleteAuth(this.props.addressCreateProceedCheck)
            Actions.auth();
          }}
        />

        <BlockUnderButton
          text={strings('Tutorial.continueGuest')}
          onPress={() => {
            this.props.authGuestLogin(() => Actions.addressCreate())
          }}
        />

         <BackButton fixed />
         <LoadingOverlay isVisible={this.props.guestlogin_loading} />
      </View>
    );
  }
}

const mapStateToProps = ({ Auth, Settings }) => {
  const { locale } = Settings;
  const {
    guestlogin_loading,
    guestlogin_error
  } = Auth;
  return {
    locale,
    guestlogin_loading,
    guestlogin_error
  };
};

export default connect(mapStateToProps, {
  onCompleteAuth,
  addressCreateProceedCheck,
  authGuestLogin
})(TutorialSwipe);
