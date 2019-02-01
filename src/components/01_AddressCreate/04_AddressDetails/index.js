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
   KeyboardAvoidingView,
   AsyncStorage,
   ScrollView
 } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  Header,
  BlockButton,
  LoadingOverlay,
  AyezText
} from '../../_common';
import {
  createNewAddress,
  calculateAreaForLocation,
  setAddressDetail
} from '../../../actions';

import {
  strings,
  translate
} from '../../../i18n.js';

// import { Circle } from 'react-native-progress';
// import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
// import {
//   setArea,
//   fetchAreas,
//   detectCurrentLocation,
//   searchAreas
// } from '../../actions';
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


class AddressDetails extends Component {

  constructor(props) {
    super(props);
  }

  createNewAddress() {
    const {
      location,
      title,
      street,
      building,
      apt,
      notes,
      type,
      area
    } = this.props;

    this.props.createNewAddress({
      location,
      title,
      street,
      building,
      apt,
      notes,
      type,
      area
    });
  }

  componentDidMount() {
    if (this.props.google_type === 'route') {
      this.props.setAddressDetail({ street: this.props.google_title });
    }
    this.props.calculateAreaForLocation(this.props.location);
  }


  onChangeText(param, text) {
    const update = {};
    update[param] = text;
    this.props.setAddressDetail(update);
  }

  renderTitle() {

    let loadingComponent = null;
    if (this.props.area_loading) {
      loadingComponent = (
        <ActivityIndicator size="small" style={{ marginLeft: 24 }} />
      )
    }

    return (
      <View style={{
        paddingLeft: 16,
        paddingTop: 16,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
      }}>
        <AyezText bold size={32}>Delivering to:</AyezText>
        { loadingComponent }
      </View>
    )
  }

  renderArea() {
    if (this.props.area) {
      return (
        <View style={{
          paddingLeft: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <AyezText semibold size={13}>
            Region:
          </AyezText>
          <AyezText semibold size={13} style={{
            flex: 1,
            alignItems: 'stretch',
            paddingLeft: 6,
            color: '#0094ff'
          }}>
            {translate(this.props.area.display_name)}
          </AyezText>
        </View>
      )
    }
    return null
  }

  renderInputField(title, param, required=true, multiline=false) {
    return (
      <View style={{
        height: 60,
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#EAEAEA',
        borderBottomWidth: 1
      }}>
        <AyezText semibold style={{
          fontSize: 15,
          width: 126
        }}>
          {title}
        </AyezText>
        <TextInput
          style={{
            flex: 1,
            alignItems: 'stretch',
            paddingLeft: 12,
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
            color: ('black')
          }}
          placeholder={required ? 'required' : 'optional'}
          placeholderTextColor={'#8E8E93'}
          value={this.props[param]}
          onChangeText={(text) => this.onChangeText(param, text)}
          underlineColorAndroid='transparent'
          autoCorrect={false}
          />
      </View>
    )
  }

  renderError() {
    const { error } = this.props;
    if (error === 'INVALID_PARAMETERS') {
      return (
        <AyezText
          regular
          color={'red'}
          style={{ textAlign: 'center' }}
          >Please fill all information</AyezText>
      )
    } else if (error === 'BAD_CONNECTION') {
      <AyezText
      regular
      color={'red'}
      style={{ textAlign: 'center' }}
      >Bad internet connection</AyezText>
    }
    return null;
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header title={'ENTER ADDRESS'}/>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
          <ScrollView style={{ flex: 1 }}>
            { this.renderTitle() }
            { this.renderArea() }


            <View style={{ height: 20 }} />

            { this.renderInputField('Street:', 'street') }
            { this.renderInputField('Building no.:', 'building') }
            { this.renderInputField('Apt no.:', 'apt') }
            { this.renderInputField('Instructions:', 'notes', false, true) }

            <View style={{ height: 20 }} />

            {this.renderError() }
            <BlockButton
              text={'CONFIRM'}
              style={{
                marginTop: 4,
                marginBottom: 24,
                marginLeft: 18,
                marginRight: 18,
                alignSelf: 'stretch'
              }}
              onPress={this.createNewAddress.bind(this)}
              />
            </ScrollView>
          </KeyboardAvoidingView>

          <LoadingOverlay isVisible={this.props.is_loading} />
      </View>
    );
  }
}

const mapStateToProps = ({ AddressReverseSearch, AddressCreate, AddressArea }) => {
  const {
    location,
    title,
    street,
    building,
    apt,
    notes,
    type,
    area,

    is_loading,
    error
  } = AddressCreate;

  const area_loading = AddressArea.is_loading;

  console.log(AddressReverseSearch);

  return {
    location,
    title,
    street,
    building,
    apt,
    notes,
    type,
    area,
    area_loading,

    google_title: AddressReverseSearch.title,
    google_type: AddressReverseSearch.type,

    is_loading,
    error
  };
};

export default connect(mapStateToProps, {
  createNewAddress,
  calculateAreaForLocation,
  setAddressDetail
})(AddressDetails);
