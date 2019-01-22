import React, { Component } from 'react';
import {
  View,
  Text,
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
  BlockButton
} from '../../_common';
import {
  setLocale
} from '../../../actions';

import {
  STATUS_BAR_HEIGHT,
  AYEZ_GREEN
} from '../../../Helpers.js';

const opening_video = require('../../../../assets/images_v2/Tutorial/opening_video.gif');

const logo = require('../../../../assets/images_v2/Common/logo.png');

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

  selectLanguage(lang) {
    this.props.setLocale(lang)
    Actions.tutorialSwipe();
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>

        <Image
          source={logo}
          style={{
            width: 160,
            alignSelf: 'center',
            height: 50,
            tintColor: AYEZ_GREEN,
            marginTop: STATUS_BAR_HEIGHT + 10
          }}
          resizeMode={'contain'}
        />

        <Image
          source={opening_video}
          style={{
            width: 350,
            alignSelf: 'center',
            flex: 1
          }}
          resizeMode={'contain'}
        />
        <BlockButton
          text={'العربيه'}
          color={'white'}
          style={{
            marginTop: 10,
            marginBottom: 10,
            marginLeft: 18,
            marginRight: 18
          }}
          textStyle={{
            color: 'black',
            fontFamily: 'Poppins-Medium'
          }}
          onPress={this.selectLanguage.bind(this, 'ar')}
          />
        <BlockButton
          text={'ENGLISH'}
          color={'white'}
          style={{
            marginTop: 10,
            marginBottom: 36,
            marginLeft: 18,
            marginRight: 18
          }}
          textStyle={{
            color: 'black',
            fontFamily: 'Poppins-Medium'
          }}
          onPress={this.selectLanguage.bind(this, 'en')}
          />
      </View>
    );
  }
}

// const mapStateToProps = ({ }) => {
//   return {};
// };

export default connect(null, {
  setLocale
})(LanguageSelect);
