import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
   Image,
   ActivityIndicator,
   TouchableOpacity,
   SectionList,
   Platform,
   BackHandler,
   AsyncStorage,
   I18nManager,
   Clipboard
 } from 'react-native';

import Share from 'react-native-share';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  Header,
  AyezText,
  BlockButton,
  CloseButton
} from '../_common';

import {
  strings,
  translate,
  FONT_REGULAR
} from '../../i18n.js';

import {
  STATUS_BAR_HEIGHT
} from '../../Helpers.js';


import images from '../../theme/images';
import colors from '../../theme/colors';


import { sceneKeys, navigateBackTo } from '../../router';

import {
  onCompleteAuth
} from '../../actions';


class ReferralPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      copied: false
    };
  }

  copyReferralCodeToClipboard() {
    this.setState({ copied: true });
    Clipboard.setString(this.props.referral_code);
  }

  shareWhatsAppCode() {
    const { name, referral_code } = this.props;

    let social = Share.Social.WHATSAPP;
    const shareOptions = {
      title: `50EGP from ${name}`,
      message: `Use this coupon for 50EGP off your first order: ${referral_code}`,
      url: 'http://onelink.to/9avxev',
      social
    };
    Share.shareSingle(shareOptions);
  }

  renderShareButtons() {
    return (
      <TouchableOpacity
        onPress={this.shareWhatsAppCode.bind(this)}
        style={{
          backgroundColor: '#25d366',
          marginTop: 40,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 4,
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <AyezText medium color={'white'}>Share with Whatsapp</AyezText>
        <Image
          source={images.whatsIcon}
          style={{
            marginLeft: 10,
            width: 30,
            height: 30,
           }}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    )
  }

  render() {
    const { phone, referral_code } = this.props;

    if (!phone) {
      return (
        <View style={{
          flex: 1,
          backgroundColor: '#FAFCFD',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <BlockButton
            color={'#0094ff'}
            style={{ paddingHorizontal: 35 }}
            onPress={() => {
              if(sceneKeys.auth != Actions.currentScene) {
                this.props.onCompleteAuth(() => navigateBackTo(sceneKeys.referralPage))
                Actions.auth();
              }
            }}
            text={strings('WorkingBasket.loginToContinue')}
          />
          <CloseButton fixed />
        </View>
      );
    }

    if (!referral_code) {
      return (
        <View style={{
          flex: 1,
          backgroundColor: '#FAFCFD',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <ActivityIndicator size="small" />
          <CloseButton fixed />
        </View>
      )
    }

    let copiedText = 'Tap to copy';
    if (this.state.copied) {
      copiedText = 'Copied!';
    }

    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD',
        alignItems: 'center'
      }}>

        <View style={{
          height: 180 + STATUS_BAR_HEIGHT,
          paddingTop: STATUS_BAR_HEIGHT + 18,
          paddingLeft: 30,
          alignItems: 'flex-start',
          backgroundColor: '#EEF2F3',
          alignSelf: 'stretch',
        }}>
          <AyezText medium size={12} color={colors.ayezGreen}>REFER AND WIN</AyezText>
          <AyezText semibold size={24}>Earn 50 EGP</AyezText>
          <AyezText regular color={'#353333'} style={{
            maxWidth: 150,
            marginTop: 6
          }}>50 EGP Free for you and a friend</AyezText>
          <Image
            source={images.rewardsIcon}
            style={{
              position: 'absolute',
              bottom: 12,
              right: 18,
              width: 180,
              height: 100
             }}
            resizeMode={'contain'}
          />
        </View>
        <AyezText regular color={'#232323'} style={{
          marginVertical: 20,
          marginHorizontal: 24
        }}>When a friend applies your coupon code on their first order, they receive a 50EGP discount and you receive 50EGP to your wallet.</AyezText>
        <TouchableOpacity
          onPress={this.copyReferralCodeToClipboard.bind(this)}
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: colors.ayezGreen,
            borderStyle: 'dashed',
            borderRadius: 4,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 14,
            marginBottom: 4,
            width: 240
          }}
        >
          <AyezText bold size={16}>{referral_code}</AyezText>
          <Image
            source={images.copyIcon}
            style={{
              width: 20,
              height: 20
             }}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
        <AyezText medium size={12}>{copiedText}</AyezText>

        {this.renderShareButtons()}
        <CloseButton fixed />
      </View>
    );
  }
}


const mapStateToProps = ({ Customer }) => {
  const {
    referral_code,
    phone,
    name
  } = Customer;
  return {
    referral_code,
    phone,
    name
  };
};

export default connect(mapStateToProps, {
  onCompleteAuth
})(ReferralPage);
