import React, { Component } from 'react';
import {
  View,
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
  BackButton,
  AyezText,
  BlockButton,
  BlockUnderButton
} from '../../_common';
import {
  resetAddressCreate,
  setCurrentLocation
} from '../../../actions';

import {
  STATUS_BAR_HEIGHT
} from '../../../Helpers.js';

import {
  strings,
  translate
} from '../../../i18n.js';

import images from '../../../theme/images'
import { sceneKeys, navigateTo } from '../../../router';



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


class CurrentLocationSelect extends Component {

  constructor(props) {
    super(props);
  }


  /* BackHandler for Android */
  componentDidMount() {
    this.props.resetAddressCreate();
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
  }
  onAndroidBackPress = () => {
    if (Actions.currentScene === sceneKeys.currentLocationSelect) {
      console.log('back disabled')
      return true;
    }
  }
  /* --------------------- */




  componentDidUpdate(prevProps) {
    // this listener is STILL RUNNING IN FUTURE COMPONENTS
    if (this.props.location && !prevProps.location) {
      navigateTo(sceneKeys.refineLocation)
    }
  }

  renderLocationPermissionButtons() {
    if (this.props.is_loading) {
      return (
        <View>
          <ActivityIndicator size="small" style={{ marginBottom: 40 }} />
        </View>
      )
    } else if (this.props.error) {
      return (
        <View>
          <AyezText
          regular style={{ textAlign: 'center' }}>{strings('AddressCreate.noLocationPermission')}</AyezText>
          <BlockButton
            text={strings('Common.OK')}
            color={'black'}
            style={{
              marginTop: 10,
              marginLeft: 18,
              marginRight: 18,
              marginBottom: 38
            }}
            onPress={() => {
              navigateTo(sceneKeys.addressSearch);
            }}
            />
        </View>
      )
    }

    return (
      <View style={{
        flexDirection: 'row',
        marginBottom: 20,
        marginHorizontal: 15
      }}>
        <BlockButton
          text={strings('Common.yes')}
          style={{
            flex: 1,
            marginRight: 5,
          }}
          onPress={() => {
            this.props.setCurrentLocation()
          }}
          />

        <BlockButton
          outline
          style={{ flex: 1, marginLeft: 5 }}
          text={strings('Common.no')}
          onPress={() => {
            navigateTo(sceneKeys.addressSearch);
          }}
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

      <AyezText
        semibold
        size={20}
        style={{
          textAlign: 'center',
          marginTop: STATUS_BAR_HEIGHT + 100,
          marginLeft: 100,
          marginRight: 100
         }}
        >{strings('AddressCreate.queryCL')}</AyezText>

        <Image
          source={images.currentLocationCover}
          style={{
            height: 240,
            width: 280,
            alignSelf: 'center'
           }}
          resizeMode={'contain'}
        />

        <View style={{ flex: 1 }} />

        { this.renderLocationPermissionButtons() }

        { this.props.addresses.length ? (<BackButton fixed />) : null }
      </View>
    );
  }
}

const mapStateToProps = ({ Addresses, AddressCreate, CurrentLocation }) => {
  const { addresses } = Addresses;
  const { location } = AddressCreate;
  const { is_loading, error } = CurrentLocation;

  return {
    addresses,
    location,
    is_loading,
    error
  };
};

export default connect(mapStateToProps, {
  resetAddressCreate,
  setCurrentLocation
})(CurrentLocationSelect);
