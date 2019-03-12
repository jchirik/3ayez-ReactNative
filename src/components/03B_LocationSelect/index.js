import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  View,
  FlatList,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  BackHandler,
  ViewPagerAndroid,
  Dimensions,
  I18nManager
} from 'react-native';
// import { Circle } from 'react-native-progress';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  selectAddress,
  logoutUser
} from '../../actions';

import {
  BackButton,
  BlockButton,
  AyezText,
  RTLImage
} from '../_common';

import {
  AYEZ_GREEN,
  AYEZ_BACKGROUND_COLOR,
  STATUS_BAR_HEIGHT,
  checkIfOpen
} from '../../Helpers';

import {
  strings,
  translate,
  formatCurrency,
  formatDay,
  formatTimestamp
} from '../../i18n.js';

import colors from '../../theme/colors'
import images from '../../theme/images'
import { sceneKeys, navigateTo, navigateBack } from '../../router';

class LocationSelect extends Component {

  render() {

    // if the address already exists, this must be a MODAL (address change)
    // otherwise it is the Welcome Back screen
    const isWelcomeBackMode = !(this.props.address);

    const addressComponents = this.props.addresses.slice(0, 5).map(address => {
      let addressHeader = address.street;
      let addressDetails = strings('Address.detail', { building: address.building, apt: address.apt });

      if (!address.street) {
        addressHeader = address.title;
        addressDetails = '';
      }
      return (
        <TouchableOpacity
          key={address.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderColor: '#f7f7f7'
           }}
         onPress={() => {
           if (this.props.address && (address.id === this.props.address.id)) {
             // if the same address selected, just pop
             navigateBack()
           } else {
             this.props.selectAddress(address);
           }
         }}
         >
          <View style={{ flex: 1, alignItems: 'flex-start' }}>
            <AyezText semibold style={{
              color: '#4E4E4E'
            }}>{addressHeader}</AyezText>
            <AyezText regular style={{
              color: '#4E4E4E'
            }}>{addressDetails}</AyezText>
          </View>

          <RTLImage
            source={images.nextArrowIcon}
            style={{
              width: 16,
              height: 16,
              tintColor: '#4E4E4E'
            }}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      )
    });

    return (
      <View style={{
        backgroundColor: colors.paleGrey,
        paddingTop: STATUS_BAR_HEIGHT + 20,
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        flex: 1
       }}>
       <AyezText medium size={15}>Welcome back {this.props.name}</AyezText>
       <AyezText regular size={15} style={{ marginTop: 5, marginBottom: 10 }}>Please confirm your location</AyezText>
        {addressComponents}

        <TouchableOpacity
          style={{
            marginTop: 20,
            paddingVertical: 10,
            paddingHorizontal: 20,
            alignSelf: 'center'
           }}
         onPress={() => navigateTo(sceneKeys.addressCreate)}
         >
          <AyezText regular color={AYEZ_GREEN}>+ New Address</AyezText>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={{
            paddingVertical: 20,
            paddingHorizontal: 10,
           }}
         onPress={() => this.props.logoutUser()}
         >
          <AyezText medium color={'red'}>Logout</AyezText>
        </TouchableOpacity>

      </View>
    )
  }
}

const mapStateToProps = ({ Customer, Seller, Addresses, Settings, OngoingOrders }) => {
  const {
    name
  } = Customer;
  const { id } = Seller;
  const { address, addresses, is_loading } = Addresses;
  return {
    name,
    seller_id: id,
    address,
    addresses,
    is_loading_addresses: is_loading,
  };
};

export default connect(mapStateToProps, {
  selectAddress,
  logoutUser
})(LocationSelect);
