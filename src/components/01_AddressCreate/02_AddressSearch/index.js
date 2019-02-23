import React, { Component } from 'react';
import {
  View,
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
  LoadingOverlay,
  AyezText
} from '../../_common';
import {
  searchAddresses,
  selectGooglePlaceResult
} from '../../../actions';

import {
  strings,
  translate
} from '../../../i18n.js';


import images from '../../../theme/images'


class AddressSearch extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.searchAddresses('', this.props.locale);
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
            source={images.searchResultPinIcon}
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
            alignItems: 'flex-start',
            flexDirection: 'column'
          }}>
            <AyezText semibold style={{
              fontSize: 15,
              color: 'black'
            }}>{item.structured_formatting.main_text}</AyezText>
            <AyezText regular style={{
              fontSize: 14,
              color: '#8E8E93',
            }}>{item.structured_formatting.secondary_text}</AyezText>
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
          <AyezText regular style={{
            margin: 40,
            color: '#8E8E93',
            fontSize: 15
          }}>{strings('AddressCreate.noLocationSearchResults')}</AyezText>
        </View>
      )
    }

    // otherwise instructions
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <AyezText regular style={{
          margin: 40,
          width: 200,
          textAlign: 'center',
          color: '#8E8E93',
          fontSize: 15
        }}>{strings('AddressCreate.addressSearchInstruction')}</AyezText>
      </View>
    )
  }

  render() {

    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header title={strings('AddressCreate.addressSearchHeader')}/>
        <SearchBar
          value={this.props.query}
          onChangeText={(text) => this.props.searchAddresses(text, this.props.locale)}
          placeholder={strings('AddressCreate.addressSearchPlaceholder')}
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

const mapStateToProps = ({ AddressSearch, AddressPlaceDetails, Settings }) => {
  const { query, is_loading, results } = AddressSearch;
  const coordinate_loading = AddressPlaceDetails.is_loading;
  const coordinate_error = AddressPlaceDetails.error;

  const { locale } = Settings;

  return {
    query,
    is_loading,
    results,
    coordinate_loading,
    coordinate_error,

    locale
  };
};

export default connect(mapStateToProps, {
  searchAddresses,
  selectGooglePlaceResult
})(AddressSearch);
