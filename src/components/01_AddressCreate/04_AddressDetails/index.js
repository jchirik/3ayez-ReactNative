import React, { Component } from 'react';
import {
  View,
  Text,
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
  BlockButton
} from '../../_common';
import {
  createNewAddress,
  setAddressDetail
} from '../../../actions';

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
    this.props.createNewAddress(this.props.new_address, this.props.addresses);
  }

  componentDidMount() {
    if (this.props.google_type === 'route') {
      this.props.setAddressDetail({ street: this.props.google_title });
    }
  }


  onChangeText(param, text) {
    const update = {};
    update[param] = text;
    this.props.setAddressDetail(update);
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
        <Text style={{
          fontFamily: 'Poppins-SemiBold',
          fontSize: 15,
          width: 126
        }}>
          {title}
        </Text>
        <TextInput
          style={{
            flex: 1,
            alignItems: 'stretch',
            paddingLeft: 12,
            fontSize: 14,
            fontFamily: 'Poppins-Medium',
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
            <Text style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 32,
              padding: 16,
            }}>Delivering to:</Text>

            { this.renderInputField('Street:', 'street') }
            { this.renderInputField('Building no.:', 'building') }
            { this.renderInputField('Apt no.:', 'apt') }
            { this.renderInputField('Instructions:', 'notes', false, true) }
            <BlockButton
              text={'CONFIRM'}
              style={{
                marginTop: 20,
                marginBottom: 24,
                marginLeft: 18,
                marginRight: 18,
                alignSelf: 'stretch'
              }}
              onPress={this.createNewAddress.bind(this)}
              />
            </ScrollView>
          </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapStateToProps = ({ AddressReverseSearch, AddressCreate, Addresses }) => {
  const {
    street,
    building,
    apt,
    notes,
    type
  } = AddressCreate;
  const new_address = AddressCreate;
  const { addresses } = Addresses;

  console.log(AddressReverseSearch);

  return {
    new_address,
    addresses,

    street,
    building,
    apt,
    notes,
    type,
    google_title: AddressReverseSearch.title,
    google_type: AddressReverseSearch.type
  };
};

export default connect(mapStateToProps, {
  createNewAddress,
  setAddressDetail
})(AddressDetails);
