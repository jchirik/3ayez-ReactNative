import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
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
// import { Circle } from 'react-native-progress';
// import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  resetAddressSearch,
  searchAddresses,
  selectGooglePlaceResult
} from '../../../actions';
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


class AddressSearch extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.resetAddressSearch();
  }

  setAddressLocation(google_place) {
    this.props.selectGooglePlaceResult(google_place);
  }

  renderItem({ item, index }) {
      return (
        <TouchableOpacity
          style={{ height: 100 }}
          onPress={this.setAddressLocation.bind(this, item)}
        >
          <Text>{item.structured_formatting.main_text} - {item.structured_formatting.secondary_text}</Text>
        </TouchableOpacity>
      );
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: 'white'
      }}>
        <TextInput
          style={{ width: 300, height: 60, backgroundColor: 'red' }}
          value={this.props.query}
          onChangeText={(query) => this.props.searchAddresses(query)}
          autoCapitalize={'none'}
          underlineColorAndroid='transparent'
          autoFocus
          />
        <FlatList
          data={this.props.results}
          renderItem={this.renderItem.bind(this)}
          style={{ marginTop: 46, flex: 1, backgroundColor: '#f7f7f7' }}
          removeClippedSubviews
          ListHeaderComponent={null}
          ListEmptyComponent={null}
          ListFooterComponent={null}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
        />
        <BackButton type='cross_circled' />
      </View>
    );
  }
}

const mapStateToProps = ({ AddressSearch }) => {
  const { query, is_loading, results } = AddressSearch;
  return {
    query,
    is_loading,
    results
  };
};

export default connect(mapStateToProps, {
  resetAddressSearch,
  searchAddresses,
  selectGooglePlaceResult
})(AddressSearch);
