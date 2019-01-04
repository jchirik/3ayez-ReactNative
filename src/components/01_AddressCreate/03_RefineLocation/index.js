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
  Header,
  BlockButton
} from '../../_common';
// import { Circle } from 'react-native-progress';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  setAddressLocation,
  reverseSearchAddress
} from '../../../actions';
// import { BlockButton, SearchBar, ModalPanel, Header } from '../_reusable';
// import { fetchRegionDisplayName, fetchRegionImage, strings, localizeDN } from '../../Helpers.js';
const pinIcon = require('../../../../assets/images_v2/AddressCreate/pin.png');




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


class RefineLocation extends Component {

  onRegionChange(point) {
    this.props.setAddressLocation({
      lat: point.latitude,
      lng: point.longitude
    });
  }

  renderPinOverlay() {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        pointerEvents="none"
      >
        <Image
          source={pinIcon}
          style={{
              width: 36,
              height: 36,
              marginBottom: 36
            }}
          resizeMode={'contain'}
        />
      </View>
    );
  }

  renderGoogleTitle() {

    let loadingSymbol = null;
    if (this.props.is_loading) {
      loadingSymbol = (
        <ActivityIndicator
        size="small"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.6)'
        }} />
      )
    }

    return (
      <View style={{
        marginTop: 8,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'center'
      }}>
        <Text style={{
          fontColor: 'black',
          fontFamily: 'Poppins-Bold',
          fontSize: 24,
        }}>
          {this.props.title}
        </Text>
        {loadingSymbol}
      </View>
    )
  }

  render() {

    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header title={'REFINE LOCATION'}/>


        <Text style={{
          textAlign: 'center',
          fontColor: 'black',
          fontFamily: 'Poppins-SemiBold',
          fontSize: 14,
          marginTop: 20
        }}>
          Refine your location by dragging the pin
        </Text>

        {this.renderGoogleTitle()}

        <View
          style={{ flex: 1 }}
        >
          <MapView
            ref={map => { this.map = map }}
            style={{ flex: 1 }}
            showsUserLocation
            provider={ PROVIDER_GOOGLE }
            initialRegion={{
              latitude: this.props.point.lat,
              longitude: this.props.point.lng,
              latitudeDelta: 0.003,
              longitudeDelta: 0.003,
            }}
            onRegionChange={this.onRegionChange.bind(this)}
            onRegionChangeComplete={() => this.props.reverseSearchAddress(this.props.point)}
          />
          {this.renderPinOverlay()}
        </View>

        <View style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          justifyContent: 'center'
        }}>
          <BlockButton
            text={'SELECT LOCATION'}
            style={{
              marginLeft: 18,
              marginRight: 18,
              alignSelf: 'stretch'
            }}
            onPress={() => Actions.addressDetails()}
            />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ AddressReverseSearch, AddressCreate }) => {
  const { point } = AddressCreate;
  const {
    title,
    is_loading
  } = AddressReverseSearch;
  return {
    point,

    title,
    is_loading
  };
};

export default connect(mapStateToProps, {
  setAddressLocation,
  reverseSearchAddress
})(RefineLocation);
