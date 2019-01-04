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
  Header
} from '../../_common';
// import { Circle } from 'react-native-progress';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  setAddressLocation
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

  onRegionChange(region) {
    this.props.setAddressLocation({
      lat: region.latitude,
      lng: region.longitude
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

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header title={'REFINE LOCATION'}/>
        <Text
          style={{ marginTop: 40 }}
        >{this.props.region} LAT {this.props.point.lat}, LNG {this.props.point.lng}</Text>

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
          />
          {this.renderPinOverlay()}
        </View>

        <TouchableOpacity
          style={{ height: 100 }}
          onPress={() => Actions.addressDetails()}
        >
          <Text>OK</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = ({ AddressCreate }) => {
  const { region, street, point } = AddressCreate;
  return {
    region,
    street,
    point
  };
};

export default connect(mapStateToProps, {
  setAddressLocation
})(RefineLocation);
