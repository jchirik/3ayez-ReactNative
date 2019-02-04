import React, { Component } from 'react';
import {
  View,
  TextInput,
   Image,
   ActivityIndicator,
   TouchableOpacity,
   SectionList,
   Platform,
   BackHandler,
   AsyncStorage
 } from 'react-native';

 import CountryPicker from 'react-native-country-picker-modal'
 const OPERATING_COUNTRIES = ['EG','SA', 'AE', 'LB','YE','JO', 'OM', 'TR', 'US'];

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  Header,
  BlockButton,
  LoadingOverlay,
  AyezText
} from '../../_common';

const dropdown_icon = require('../../../../assets/images_v2/Common/dropdown.png');

import {
  authPhoneSet,
  authCountryCodeSet,
  authPhoneLogin
} from '../../../actions';

import {
  strings,
  translate
} from '../../../i18n.js';

class PhoneEntry extends Component {

  constructor(props) {
    super(props);
  }

  authPhoneLogin() {
    this.props.authPhoneLogin(this.props.phone, this.props.call_code);
  }

  renderPhoneInput() {
    return (
      <View style={{
        height: 48,
        borderRadius: 8,
        backgroundColor: 'white',
        margin: 20,
        flexDirection: 'row',
        alignItems: 'stretch',

        shadowColor: '#000',
        shadowOffset: { width: -1, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
      }}>

        <TouchableOpacity
          style={{
            paddingLeft: 16,
            paddingRight: 18,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
          }}
          onPress={() => this.countryPicker.openModal()}
        >
          <AyezText
            regular
            style={{
              fontSize: 14
            }}
          >+{this.props.call_code}</AyezText>
          <Image
            source={dropdown_icon}
            style={{
              width: 11,
              height: 11,
              marginLeft: 6
             }}
            resizeMode={'contain'}
          />
        </TouchableOpacity>

        <TextInput
          style={{
            flex: 1,
            paddingLeft: 6,
            fontSize: 14,
            fontFamily: 'Poppins-Regular'
          }}
          placeholder={'write your number'}
          placeholderTextColor={'#8E8E93'}
          value={this.props.phone}
          onChangeText={(phone) => this.props.authPhoneSet(phone)}
          autoCapitalize={'none'}
          underlineColorAndroid='transparent'
          keyboardType={'phone-pad'}
          autoCorrect={false}
          autoFocus
          />
      </View>
    )
  }

  renderCountryPickerModal() {
    return (
      <CountryPicker
        ref={ref => (this.countryPicker = ref)}
        countryList={OPERATING_COUNTRIES}
        onChange={value => this.props.authCountryCodeSet(value.cca2, value.callingCode)}
        cca2={this.props.country_code}
        filterable
        closeable
      >
        <View />
      </CountryPicker>
    )
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header title={'REGISTER USER'}/>
        <View>
          <AyezText bold
            style={{
              fontSize: 14,
              marginTop: 22,
              marginLeft: 26,
              alignSelf: 'flex-start'
            }}
          >Enter your phone number below</AyezText>

          { this.renderPhoneInput() }
          { this.renderCountryPickerModal() }

          <AyezText light
            style={{
              fontSize: 12,
              textAlign: 'center',
              marginTop: 18,
              marginBottom: 10
            }}
          >Tap Next to get an SMS confirmation</AyezText>
          <BlockButton
            text={'NEXT'}
            style={{
              marginLeft: 18,
              marginRight: 18
            }}
            onPress={this.authPhoneLogin.bind(this)}
          />
          <LoadingOverlay isVisible={this.props.phone_loading} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ Auth }) => {
  const {
    phone,
    country_code,
    call_code,
    phone_loading,
    phone_error
  } = Auth;
  return {
    phone,
    country_code,
    call_code,
    phone_loading,
    phone_error
  };
};

export default connect(mapStateToProps, {
  authPhoneSet,
  authCountryCodeSet,
  authPhoneLogin
})(PhoneEntry);
