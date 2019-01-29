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

import { connect } from 'react-redux';
import {
  BackButton,
  AyezText
} from '../../_common';
import {
  resetAddressCreate,
  setAddressRegion
} from '../../../actions';

import {
  strings,
  translate
} from '../../../i18n.js';

import CurrentLocationModal from './CurrentLocationModal';

const alexandria_icon = require('../../../../assets/images_v2/Regions/alexandria.png');
const giza_icon = require('../../../../assets/images_v2/Regions/giza.png');
const cairo_icon = require('../../../../assets/images_v2/Regions/cairo.png');

// import { Circle } from 'react-native-progress';
// import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';

// import { BlockButton, SearchBar, ModalPanel, Header } from '../_reusable';
// import { fetchRegionDisplayName, fetchRegionImage, strings, localizeDN } from '../../Helpers.js';
// const comingSoonImage = require('../../../assets/images/coming_soon.png');




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


class RegionSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentLocationModal: false
    };
  }

  componentDidMount() {
    this.props.resetAddressCreate();
  }

  setAddressRegion(region) {
    this.props.resetAddressCreate();
    this.props.setAddressRegion(region);
    this.setState({ currentLocationModal: true });
  }

  renderCityButton(region) {

    let region_icon = null;
    switch (region) {
      case 'CAIRO':
        region_icon = cairo_icon;
        break;
      case 'ALEXANDRIA':
        region_icon = alexandria_icon;
        break;
      case 'GIZA':
        region_icon = giza_icon;
        break;
      default:
        return;
    }

    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: 8,
          marginTop: 10,
          marginBottom: 10,
          marginLeft: 16,
          marginRight: 16,

          shadowColor: '#000',
          shadowOffset: { width: -1, height: 3 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 2,
        }}
        onPress={this.setAddressRegion.bind(this, region)}
        >
        <Image
          source={region_icon}
          style={{
            width: 40,
            height: 40,
            borderRadius: 24,
            margin: 6,
            marginLeft: 20,
            marginRight: 24,
           }}
          resizeMode={'contain'}
          />
        <AyezText medium style={{
          color: 'black',
          fontSize: 15
        }}>{region}</AyezText>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>

        <Image
          source={null}
          style={{
            flex: 1,
            backgroundColor: '#cecece'
           }}
          resizeMode={'contain'}
        />
        <AyezText bold style={{
          fontSize: 15,
          marginTop: 40,
          marginLeft: 22,
          marginBottom: 20,
          alignSelf: 'flex-start'
        }}>Select your city</AyezText>

        { this.renderCityButton('ALEXANDRIA') }
        { this.renderCityButton('CAIRO') }
        { this.renderCityButton('GIZA') }

        <View style={{ height: 60 }} />

        { this.props.addresses.length ? (<BackButton fixed />) : null }
        <CurrentLocationModal
          visible={this.state.currentLocationModal}
          onClose={() => {
            this.setState({ currentLocationModal: false });
          }}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ Addresses }) => {
  const { addresses } = Addresses;
  return {
    addresses
  };
};

export default connect(mapStateToProps, {
  resetAddressCreate,
  setAddressRegion
})(RegionSelect);
