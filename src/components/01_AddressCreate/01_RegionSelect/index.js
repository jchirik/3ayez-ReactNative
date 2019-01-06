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
  BackButton
} from '../../_common';
import {
  resetAddressCreate,
  setAddressRegion
} from '../../../actions';

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
  }
  componentDidMount() {
    this.props.resetAddressCreate();
  }

  setAddressRegion(region) {
    this.props.setAddressRegion(region);
    Actions.addressSearch();
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
        <Text style={{
          color: 'black',
          fontFamily: 'Poppins-Medium',
          fontSize: 15
        }}>{region}</Text>
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

        <Text style={{
          fontSize: 15,
          marginTop: 40,
          marginLeft: 22,
          marginBottom: 20,
          color: 'black',
          fontFamily: 'Poppins-Bold'
        }}>Select your city</Text>

        { this.renderCityButton('ALEXANDRIA') }
        { this.renderCityButton('CAIRO') }
        { this.renderCityButton('GIZA') }

        <View style={{ height: 60 }} />

        <BackButton fixed />
      </View>
    );
  }
}

// const mapStateToProps = ({ }) => {
//   return {};
// };

export default connect(null, {
  resetAddressCreate,
  setAddressRegion
})(RegionSelect);
