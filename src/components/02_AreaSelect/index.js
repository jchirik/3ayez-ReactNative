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

const window = Dimensions.get('window');

// fetchSavedAreas
// selectArea

// selected_area,
// saved_areas,
// is_loading_saved_areas

class AreaSelect extends Component {

  componentDidMount() {
    this.props.fetchSavedAreas();
  }

    renderAreaTile({ item, index }) {

      if (item.isCreateAreaTile) {
        return (
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: (window.width/2) - 12,
              height: (window.width/2) * 1.3,
              paddingHorizontal: 10,
              paddingTop: 20
            }}
            onPress={() => navigateTo(sceneKeys.areaCreate)}
          >
            <View style={{
              borderWidth: 2,
              borderColor: colors.ayezGreen,
              borderStyle: 'dashed',
              width: '100%',
              height: '100%',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Image
                source={images.mapLocationIcon}
                style={{
                  width: '44%',
                  height: '80%',
                  marginTop: 4,
                  tintColor: colors.ayezGreen
                }}
                resizeMode={'contain'}
              />

              <View style={{ flex: 1 }} />
              <AyezText semibold size={15} color={colors.ayezGreen}
                style={{
                  textAlign: 'center',
                  marginBottom: 10
                }}>
                {strings('AreaSelect.addArea')}
              </AyezText>
            </View>
          </TouchableOpacity>
        );
      }

      const { id, display_name, image_url } = item;

      let tileContent = (
          <AyezText semibold size={15} color={colors.ayezGreen}
            style={{
              textAlign: 'center'
            }}>
            {translate(display_name)}
          </AyezText>
      );

      if (image_url) {
        tileContent = [
            <Image
              source={{ uri: image_url }}
              style={{
                width: '95%',
                height: '80%',
                marginTop: 4,
                borderRadius: 10,
                backgroundColor: '#f7f7f7'
              }}
              resizeMode={'cover'}
            />,
            <View style={{ flex: 1 }} />,
            <AyezText semibold size={15} color={colors.ayezGreen}
              style={{
                textAlign: 'center',
                marginBottom: 10
              }}>
              {translate(display_name)}
            </AyezText>
        ];
      }

      return (
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: (window.width/2) - 12,
            height: (window.width/2) * 1.3,
            paddingHorizontal: 10,
            paddingTop: 20
          }}
          onPress={() => this.props.selectArea(item)}
        >
          <View style={{
            backgroundColor: 'white',
            width: '100%',
            height: '100%',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            ...Platform.select({
              ios: {
                shadowColor: colors.warmGrey,
                shadowOpacity: 0.25,
                shadowRadius: 5
              },
              android: {
                elevation: 2
              }
            })
          }}>
            {tileContent}
          </View>
        </TouchableOpacity>
      );
    }



  render() {


    // indicate no internet issues
    // show tracking order from this screen
    if (this.props.is_loading_saved_areas) {
      return (
        <ActivityIndicator size="small" style={{ flex: 1, backgroundColor: colors.paleGrey }} />
      )
    }

    // if the address already exists, this must be a MODAL (address change)
    // otherwise it is the Welcome Back screen
    const isWelcomeBackMode = !(this.props.selected_area);

    let greetingText = ''
    if (isWelcomeBackMode) {
      greetingText = strings('AddressSelection.welcomeBack', {name: this.props.name})
    }

    return (
      <View style={{
        backgroundColor: colors.paleGrey,
        flex: 1
       }}>

       <OrderStatusBar color={colors.paleGrey}/>

       <View style={{ marginTop: 14, marginLeft: 26, alignItems: 'flex-start'}}>
         <AyezText medium size={18}>{greetingText}</AyezText>
         <AyezText
          semibold size={20}
          style={{ marginTop: 5}}
          >{strings('AreaSelect.selectYourArea')}</AyezText>
        </View>

       <FlatList
         key={'REGION_LIST'}
         data={[ ...this.props.saved_areas.slice(0, 5), { isCreateAreaTile: true } ]}
         renderItem={this.renderAreaTile.bind(this)}
         style={{ flex: 1, marginHorizontal: 12 }}
         alwaysBounceVertical={false}
         ListHeaderComponent={<View style={{ height: 5 }} />}
         ListFooterComponent={<View style={{ height: 40 }} />}
         numColumns={2}
         showsVerticalScrollIndicator={false}
         keyExtractor={(item, index) => item.id}
       />

        <LoadingOverlay isVisible={this.props.is_loading_address_select} />
      </View>
    )
  }
}




       // {strings('AddressSelection.header')}
       //
       //
       //    <TouchableOpacity
       //      style={{
       //        marginTop: 20,
       //        paddingVertical: 10,
       //        paddingHorizontal: 20,
       //        alignSelf: 'center'
       //       }}
       //     onPress={() => navigateTo(sceneKeys.areaCreate)}
       //     >
       //      <AyezText regular color={AYEZ_GREEN}>+ ADD NEW AREA</AyezText>
       //    </TouchableOpacity>
       //
       //    <View style={{ flex: 1 }} />
       //
       //    <TouchableOpacity
       //      style={{
       //        paddingVertical: 20,
       //        paddingHorizontal: 10,
       //       }}
       //     onPress={() => this.props.logoutUser()}
       //     >
       //      <AyezText medium color={'red'}>{strings('Common.logout')}</AyezText>
       //    </TouchableOpacity>
       //
       //  </View>

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
