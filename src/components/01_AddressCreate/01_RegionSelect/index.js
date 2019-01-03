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

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
      }}>

        <TouchableOpacity onPress={this.setAddressRegion.bind(this, 'CAIRO')}>
          <Text>CAIRO</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.setAddressRegion.bind(this, 'ALEXANDRIA')}>
          <Text>ALEXANDRIA</Text>
        </TouchableOpacity>

        <BackButton type='cross_circled' />
      </View>
    );
  }
}

const mapStateToProps = ({ }) => {
  return {};
};

export default connect(mapStateToProps, {
  resetAddressCreate,
  setAddressRegion
})(RegionSelect);
