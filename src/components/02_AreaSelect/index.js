import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  View,
  FlatList,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  BackHandler,
  ViewPagerAndroid,
  Dimensions,
  I18nManager
} from 'react-native';
// import { Circle } from 'react-native-progress';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  fetchSavedAreas,
  selectArea,
  logoutUser
} from '../../actions';

import {
  BackButton,
  BlockButton,
  AyezText,
  RTLImage,
  LoadingOverlay,
  OrderStatusBar
} from '../_common';

import {
  AYEZ_GREEN,
  AYEZ_BACKGROUND_COLOR,
  STATUS_BAR_HEIGHT,
  checkIfOpen
} from '../../Helpers';

import {
  strings,
  translate,
  formatCurrency,
  formatDay,
  formatTimestamp
} from '../../i18n.js';

import colors from '../../theme/colors'
import images from '../../theme/images'
import { sceneKeys, navigateTo, navigateBack } from '../../router';

// fetchSavedAreas
// selectArea

// selected_area,
// saved_areas,
// is_loading_saved_areas

class AreaSelect extends Component {

  componentDidMount() {
    this.props.fetchSavedAreas();
  }

  render() {


    // indicate no internet issues
    // show tracking order from this screen

    if (this.props.is_loading_saved_areas || !this.props.saved_areas.length) {
      return (
        <ActivityIndicator size="small" style={{ flex: 1, backgroundColor: colors.paleGrey }} />
      )
    }

    // if the address already exists, this must be a MODAL (address change)
    // otherwise it is the Welcome Back screen
    const isWelcomeBackMode = !(this.props.selected_area);

    const areaComponents = this.props.saved_areas.slice(0, 5).map(area => {
      return (
        <TouchableOpacity
          key={area.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderColor: '#f7f7f7'
           }}
         onPress={() => {
           // if (this.props.address && (address.id === this.props.address.id)) {
           //   // if the same address selected, just pop
           //   navigateBack()
           // } else {
           this.props.selectArea(area);
           //}
         }}
         >
          <View style={{ flex: 1, alignItems: 'flex-start' }}>
            <AyezText semibold style={{
              color: '#4E4E4E'
            }}>{translate(area.display_name)}</AyezText>
          </View>

          <RTLImage
            source={images.nextArrowIcon}
            style={{
              width: 16,
              height: 16,
              tintColor: '#4E4E4E'
            }}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      )
    });

    return (
      <View style={{
        backgroundColor: colors.paleGrey,
        flex: 1
       }}>

       <OrderStatusBar color={'white'}/>

         <View style={{
           alignItems: 'flex-start',
           paddingHorizontal: 20,
           marginTop: 20,
           flex: 1
         }}>

         {isWelcomeBackMode ? (<AyezText medium size={15}>{strings('AddressSelection.welcomeBack', {name: this.props.name})}</AyezText>) : null }
         <AyezText regular size={15} style={{ marginTop: 5, marginBottom: 10 }}>{strings('AddressSelection.header')}</AyezText>
          {areaComponents}

          <TouchableOpacity
            style={{
              marginTop: 20,
              paddingVertical: 10,
              paddingHorizontal: 20,
              alignSelf: 'center'
             }}
           onPress={() => navigateTo(sceneKeys.areaCreate)}
           >
            <AyezText regular color={AYEZ_GREEN}>+ ADD NEW AREA</AyezText>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={{
              paddingVertical: 20,
              paddingHorizontal: 10,
             }}
           onPress={() => this.props.logoutUser()}
           >
            <AyezText medium color={'red'}>{strings('Common.logout')}</AyezText>
          </TouchableOpacity>

        </View>

        <LoadingOverlay isVisible={this.props.is_loading_address_select} />
      </View>
    )
  }
}

const mapStateToProps = ({ Customer, Seller, Areas, Settings, OngoingOrders }) => {
  const {
    name
  } = Customer;
  const { id } = Seller;

  const {
    selected_area,
    saved_areas,
    is_loading_saved_areas
  } = Areas;

  return {
    name,
    seller_id: id,

    selected_area,
    saved_areas,
    is_loading_saved_areas
  };
};

export default connect(mapStateToProps, {
  fetchSavedAreas,
  selectArea,
  logoutUser
})(AreaSelect);
