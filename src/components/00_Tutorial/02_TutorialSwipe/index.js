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
   Dimensions,
   I18nManager
 } from 'react-native';

import { ViewPager } from 'rn-viewpager';

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

const NUM_PAGES = 3;

import images from '../../../theme/images'
import { sceneKeys, navigateTo } from '../../../router';

const window = Dimensions.get('window');

class TutorialSwipe extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected_index: 0
    };
  }

  componentDidMount() {
    this.props.onCompleteAuth(this.props.addressCreateProceedCheck)
  }

  renderDotIndicator() {
    const dots = [];

    const selectedDotStyle = {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: AYEZ_GREEN
    };
    const unselectedDotStyle = {
      height: 4,
      width: 4,
      borderRadius: 2,
      backgroundColor: '#BBBBBB'
    };

    for (let i = 0; i < NUM_PAGES; i++) {
      dots.push(
        <View
          key={`${i}`}
          style={[{
              marginLeft: 10,
              marginRight: 10
            },
            (i === this.state.selected_index) ? selectedDotStyle : unselectedDotStyle
          ]}
        />
      )
    }
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 10
      }}>
        {dots}
      </View>
    )
  }

  render() {

    let tutorial1 = images.tutorial1en;
    if (this.props.locale === 'ar') {
      tutorial1 = images.tutorial1ar;
    }

    let pages = [
        { title: strings('Tutorial.t1header'), image: tutorial1 },
        { title: strings('Tutorial.t2header'), image: images.tutorial2 },
        { title: strings('Tutorial.t3header'), image: images.tutorial3 }
    ].map((page) => (
      <View
        key={page.title}
        style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <RTLImage
            source={page.image}
            style={{
              alignSelf: 'center',
              height: window.width,
              width: window.width
            }}
            resizeMode={'contain'}
          />
          <AyezText semibold size={18} style={{
            marginTop: 20,
            marginBottom: 30
          }}>{page.title}</AyezText>
        </View>
    ))

    // necessary because android RTL was unusual behavior
    const isAndroidRTL = (Platform.OS === 'android') && (I18nManager.isRTL);
    if (isAndroidRTL) { pages = pages.reverse(); }

    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <ViewPager
            initialPage={isAndroidRTL ? 2 : 0}
            style={{ flex: 1 }}
            onPageSelected={({ position }) => this.setState({
              selected_index: (isAndroidRTL ? NUM_PAGES - position - 1 : position)
            })}
          >
          { pages }
        </ViewPager>

        {this.renderDotIndicator()}

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
            navigateTo(sceneKeys.auth);
          }}
        />

        <BlockUnderButton
          text={strings('Tutorial.continueGuest')}
          onPress={() => {
            this.props.authGuestLogin();
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
