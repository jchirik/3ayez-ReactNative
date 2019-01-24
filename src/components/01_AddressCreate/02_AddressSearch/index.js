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
  Header,
  SearchBar,
  LoadingOverlay
} from '../../_common';
// import { Circle } from 'react-native-progress';
// import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  searchAddresses,
  selectGooglePlaceResult
} from '../../../actions';

const result_pin_icon = require('../../../../assets/images_v2/Search/result_pin.png');
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
    this.props.searchAddresses('');
  }

  setAddressLocation(google_place) {
    this.props.selectGooglePlaceResult(google_place);
  }

  renderItem({ item, index }) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            borderColor: '#EAEAEA',
            borderBottomWidth: 1,
            alignItems: 'center',
            height: 60
          }}
          onPress={this.setAddressLocation.bind(this, item)}
        >
          <Image
            source={result_pin_icon}
            style={{
              width: 24,
              height: 24,
              marginLeft: 10,
              marginRight: 8
             }}
            resizeMode={'contain'}
          />
          <View style={{
            flex: 1,
            flexDirection: 'column'
          }}>
            <Text style={{
              fontSize: 15,
              color: 'black',
              fontFamily: 'Poppins-SemiBold'
            }}>{item.structured_formatting.main_text}</Text>
            <Text style={{
              fontSize: 14,
              color: '#8E8E93',
              fontFamily: 'Poppins-Regular'
            }}>{item.structured_formatting.secondary_text}</Text>
          </View>
        </TouchableOpacity>
      );
  }

  renderEmptyComponent() {

    // if there are no results, and loading, then show spinner
    if (this.props.is_loading) {
      return (
        <ActivityIndicator size="small" style={{ flex: 1 }} />
      );
    }
    // if no results returned, say so
    if (this.props.query) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{
            margin: 40,
            color: '#8E8E93',
            fontSize: 15,
            fontFamily: 'Poppins-Regular'
          }}>No Results</Text>
        </View>
      )
    }

    // otherwise instructions
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{
          margin: 40,
          width: 200,
          textAlign: 'center',
          color: '#8E8E93',
          fontSize: 15,
          fontFamily: 'Poppins-Regular'
        }}>Let us know where you are to send your orders.</Text>
      </View>
    )
  }

  render() {

    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header title={'DELIVERY ADDRESS'}/>
        <SearchBar
          value={this.props.query}
          onChangeText={this.props.searchAddresses.bind(this)}
          placeholder={'search for new address, city, street'}
          autofocus
        />
        <FlatList
          data={this.props.results}
          renderItem={this.renderItem.bind(this)}
          style={{ marginTop: 6, flex: 1 }}
          removeClippedSubviews
          ListHeaderComponent={null}
          ListEmptyComponent={this.renderEmptyComponent()}
          ListFooterComponent={null}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
        />
        <LoadingOverlay isVisible={this.props.coordinate_loading} />
      </View>
    );
  }
}

const mapStateToProps = ({ AddressSearch, AddressPlaceDetails }) => {
  const { query, is_loading, results } = AddressSearch;
  const coordinate_loading = AddressPlaceDetails.is_loading;
  const coordinate_error = AddressPlaceDetails.error;

  return {
    query,
    is_loading,
    results,
    coordinate_loading,
    coordinate_error
  };
};

export default connect(mapStateToProps, {
  searchAddresses,
  selectGooglePlaceResult
})(AddressSearch);
