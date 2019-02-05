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
  Dimensions
} from 'react-native';
// import { Circle } from 'react-native-progress';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';

import { ViewPager } from 'rn-viewpager';
import FastImage from 'react-native-fast-image'

import AddressSelection from './AddressSelection';

import {
  fetchNearbySellers,
  selectSeller
} from '../../../actions';
import {
  BackButton,
  BlockButton,
  AyezText
} from '../../_common';

import {
  strings,
  translate,
  formatCurrency
} from '../../../i18n.js';

const star_icon = require('../../../../assets/images_v2/Common/star.png');

const SCREEN_WIDTH = Dimensions.get('window').width;
// findStoresForLocation,
// setSelectedSeller,
// setBaskets,
// setArea,
//
// setLocale,
// submitOrderSubstitutions,
// markOrderComplete,
// getContacts

// import { OrderStatusBar, Header, ModalPanel, InputField, BlockButton } from '../_reusable';
//
// import StoreSelectionHeader from './StoreSelectionHeader';
//
// const fullStarIcon = require('../../../assets/images/stars/full_star.png');
// const halfStarIcon = require('../../../assets/images/stars/half_star.png');
// const emptyStarIcon = require('../../../assets/images/stars/empty_star.png');
//
// const warningIcon = require('../../../assets/images/order_statuses/problem.png');
// const arrowCircle = require('../../../assets/images/arrow_circle.png');
// const deliveryTruckIcon = require('../../../assets/images/delivery_truck.png');
//
// const window = Dimensions.get('window');
//
// const ImgCacheLib = require('react-native-img-cache');
// const CachedImage = ImgCacheLib.CachedImage;




// CONSIDER: if detected location changes by X, soft confirm delivery address
// recent UPCs in the store should be returned via cloud FX, not via client-side calculation


class StoreSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isAddressSelectionVisible: false
    };
  }

  fetchNearbySellers() {
    this.props.fetchNearbySellers(this.props.point, '10th_of_ramadan'); // load nearby stores upon open
  }

  componentDidMount() {
    console.log('Store Select mounted')
    this.fetchNearbySellers();
  }

  componentDidUpdate(prevProps) {

    if (this.props.point !== prevProps.point) {
      this.fetchNearbySellers(); // load nearby stores upon change
    }
  }

  onSelectSeller(seller) {
    this.props.selectSeller(seller); // sets seller and navigates to store page
  }

  // every time the app is reopened (from sleep or switching apps, > 45min),
  // IF the app is reopened, refetch sellers
  // handleAppReopen = (nextAppState) => {
  //   this.props.updateCurrentLocation(this.props.geofences);
  // }


renderAddressHeader() {
  return (
    <TouchableOpacity
      onPress={() => this.setState({ isAddressSelectionVisible: true })}
      style={{
        marginTop: 6,
        paddingBottom: 3,
        flexDirection: 'column',
        alignItems: 'stretch',
        borderBottomWidth: 1,
        borderColor: '#EAEAEA'
      }}
    >
      <AyezText medium style={{
        color: '#2DD38F',
        fontSize: 12,
        textAlign: 'center'
      }}>{strings('StoreSelect.deliveringTo')}</AyezText>
      <AyezText semibold style={{
        color: 'black',
        fontSize: 28,
        textAlign: 'center'
      }}>{this.props.street}</AyezText>
    </TouchableOpacity>
  )
}

renderNoInternetConnection() {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <AyezText regular style={{
        color: '#8E8E93',
        fontSize: 18,
        margin: 10
      }}>{strings('Common.noInternet')}</AyezText>
      <BlockButton
        text={strings('Common.refresh')}
        color={'#666666'}
        style={{ width: 200 }}
        onPress={() => this.fetchNearbySellers()}
        />
    </View>
  );
}

renderImageScroll(item) {
  const { banner_images } = item;
  let imageComponents = [];
  if (!banner_images || banner_images.length === 0) {
    imageComponents = [(
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.onSelectSeller.bind(this, item)}
        style={{ paddingHorizontal: 4 }}>
        <Image
          source={null}
          style={{
            flex: 1,
            backgroundColor: '#cecece',
            borderRadius: 4
          }}
        />
      </TouchableOpacity>
    )]
  } else {
    imageComponents = banner_images.map(url => (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.onSelectSeller.bind(this, item)}
        style={{ paddingHorizontal: 4 }}>
        <FastImage
          source={{ uri: url }}
          resizeMode={'cover'}
          style={{
            flex: 1,
            backgroundColor: '#cecece',
            borderRadius: 4
          }}
        />
      </TouchableOpacity>
    ))
  }

  return (
    <ViewPager style={{ height: SCREEN_WIDTH*3/8 }}>
      {imageComponents}
    </ViewPager>
  )
}

renderItem({ item, index }) {
    return (
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'stretch',
          padding: 12,
          borderColor: '#EAEAEA',
          borderBottomWidth: 1
        }}
        >
        {this.renderImageScroll(item)}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={this.onSelectSeller.bind(this, item)}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 5
          }}>
            <AyezText regular style={{
              fontSize: 16,
            }}>{translate(item.display_name).toUpperCase()}</AyezText>
            <Image
              source={{ uri: item.logo_url }}
              resizeMode={'contain'}
              style={{
                width: 40,
                height: 40,
                borderRadius: 4
              }}
            />
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 4
          }}>
            <AyezText extralight style={styles.storeDetailText}>{strings('StoreSelect.minTotal', {min: formatCurrency(item.minimum)})}</AyezText>
            <AyezText extralight style={styles.storeDetailText}>{strings('StoreSelect.openHours', {start: item.hours.start, end: item.hours.end})}</AyezText>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 2
          }}>
            <View style={{ flexDirection: 'row' }}>
              <AyezText semibold style={{
                fontSize: 11,
                color: '#2DD38F'
              }}>{item.num_stars.toFixed(1)}</AyezText>
              <Image
                source={star_icon}
                style={{
                  width: 14,
                  height: 14,
                  tintColor: '#2DD38F',
                  marginBottom: 3,
                  marginLeft: 4,
                  marginRight: 7
                }}
                resizeMode={'contain'}
              />
              <AyezText extralight style={styles.storeDetailText}>{strings('StoreSelect.numRatings', {num_reviews: 120})}</AyezText>
            </View>
            <AyezText extralight style={styles.storeDetailText}>{strings('StoreSelect.deliveryTime', {delivery_time: item.delivery_time})}</AyezText>
          </View>
        </TouchableOpacity>
      </View>
    );
}

renderSellerList() {

  if (this.props.is_loading) {
    return (
      <ActivityIndicator size="small" style={{ flex: 1 }} />
    )
  }
  if (this.props.error) {
    return this.renderNoInternetConnection();
  }
  return (
    <FlatList
      data={this.props.sellers}
      renderItem={this.renderItem.bind(this)}
      style={{ flex: 1 }}

      removeClippedSubviews
      ListHeaderComponent={null}
      ListEmptyComponent={null}
      ListFooterComponent={null}

      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index}
    />
  )
}

  render() {

    // return (
    //   <View style={{ flex: 1, backgroundColor:'red'}}>
    //     <MapView
    //        ref={map => { this.map = map }}
    //        style={{ flex: 1 }}
    //        provider={PROVIDER_GOOGLE}
    //        showsUserLocation
    //      >
    //      </MapView>
    //   </View>
    // )

    return (
      <View style={{ flex: 1 }}>
        {this.renderAddressHeader()}
        {this.renderSellerList()}

        <AddressSelection
          onClose={() => this.setState({ isAddressSelectionVisible: false })}
          isVisible={this.state.isAddressSelectionVisible}
          />
      </View>
    );
  }
}


// <SoftConfirmModal
//   onClose={() => this.setState({ locationConfirmModal: false }) }
//   visible={this.state.locationConfirmModal}
// />



const styles = {
  storeDetailText: {
    fontSize: 11,
    color: '#8E8E93'
  }
};

const mapStateToProps = ({ Addresses, SellerSearch }) => {
  const { addresses, address } = Addresses;

  const street = address ? address.street : null;
  const point = address ? address.point : null;

  const { sellers, is_loading, error } = SellerSearch;
  return {
    address,
    street,
    point,

    sellers,
    is_loading,
    error
  };
};

export default connect(mapStateToProps, {
  fetchNearbySellers,
  selectSeller
})(StoreSelect);
