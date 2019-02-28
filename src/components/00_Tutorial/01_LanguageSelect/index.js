import React, { Component } from 'react';
import {
  View,
  Image,
   ActivityIndicator,
   TouchableOpacity,
   SectionList,
   Platform,
   BackHandler,
   AsyncStorage
 } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  BlockButton,
  BlockUnderButton,
  RTLImage,
  AyezText
} from '../../_common';
import {
  setLocale
} from '../../../actions';

import {
  STATUS_BAR_HEIGHT,
  AYEZ_GREEN
} from '../../../Helpers.js';

import {
  strings,
  translate
} from '../../../i18n.js';

import images from '../../../theme/images'
import { sceneKeys, navigateTo } from '../../../router';

// add language select + very short tutorial

// steps:
// 1. request for current location. show a popup first, asking if should use
// current location. if available, skip to 4.
// -
// 2. IF NO LOCATION, pick city
// 3. text search for location
// -
// 4. refine pin
// 5. reverse fetch street, apt number (if not already provided)
// 6. present form for finalizing delivery, with prefilled street/building info

// each address should include notes from our driver console, so driver admins
// can attach additional info that makes it easier to find

// first time you open the app -> go to store tab to start
// every other time -> go to discover page to start


class LanguageSelect extends Component {

  constructor(props) {
    super(props);
  }

  /* BackHandler for Android */
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
  }
  onAndroidBackPress = () => {
    if (Actions.currentScene === sceneKeys.languageSelect) {
      console.log('back disabled')
      return true;
    }
  }
  /* --------------------- */


  switchLanguage(switchLocale) {
    this.props.setLocale(switchLocale)
  }

  render() {
    if (!this.props.locale) {
      return (
        <ActivityIndicator size="small" />
      )
    }

    let switchText = strings('Tutorial.switchEnglish');
    let switchLocale = 'en';
    if (this.props.locale === 'en') {
      switchText = strings('Tutorial.switchArabic');
      switchLocale = 'ar';
    }

    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>

        <Image
          source={images.logo}
          style={{
            width: 160,
            alignSelf: 'center',
            height: 50,
            tintColor: AYEZ_GREEN,
            marginTop: STATUS_BAR_HEIGHT + 10
          }}
          resizeMode={'contain'}
        />

        <RTLImage
          source={images.openingGIF}
          style={{
            width: 300,
            marginLeft: 20,
            alignSelf: 'center',
            flex: 1
          }}
          resizeMode={'contain'}
        />
        <BlockButton
          text={strings('Tutorial.getStarted')}
          style={{
            marginTop: 10,
            marginLeft: 18,
            marginRight: 18
          }}
          onPress={() => { 
            navigateTo(sceneKeys.tutorialSwipe)
          }}
          />
        <BlockUnderButton
          text={switchText}
          onPress={this.switchLanguage.bind(this, switchLocale)}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ Settings }) => {
  const { locale } = Settings;
  return { locale };
};

export default connect(mapStateToProps, {
  setLocale
})(LanguageSelect);
