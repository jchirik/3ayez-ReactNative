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
import {
  fetchNearbySellers,
  selectSeller
} from '../../../actions';
import {
  BackButton,
  BlockButton,
  AyezText
} from '../../_common';
import { strings, translate } from '../../../i18n.js';
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


import { STATUS_BAR_HEIGHT } from '../../../Helpers.js';
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

  onAddressSelect() {
    Actions.addressCreate();
  }

  // every time the app is reopened (from sleep or switching apps, > 45min),
  // IF the app is reopened, refetch sellers
  // handleAppReopen = (nextAppState) => {
  //   this.props.updateCurrentLocation(this.props.geofences);
  // }


renderAddressHeader() {
  return (
    <TouchableOpacity
      onPress={this.onAddressSelect.bind(this)}
      style={{
        marginTop: STATUS_BAR_HEIGHT + 6,
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
      }}>{strings('StoreSelect.noInternet')}</AyezText>
      <BlockButton
        text={strings('StoreSelect.refresh')}
        color={'#666666'}
        style={{ width: 200 }}
        onPress={() => this.fetchNearbySellers()}
        />
    </View>
  );
}


renderItem({ item, index }) {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'column',
          alignItems: 'stretch',
          padding: 12,
          borderColor: '#EAEAEA',
          borderBottomWidth: 1
        }}
        onPress={this.onSelectSeller.bind(this, item)}
        >
        <View style={{
          backgroundColor: 'gray',
          borderRadius: 4,
          height: SCREEN_WIDTH/3
        }} />
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
          <AyezText extralight style={styles.storeDetailText}>{strings('StoreSelect.minTotal', {min: item.minimum})}</AyezText>
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
              color: '#2DD38F',
              fontFamily: 'Poppins-SemiBold'
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
      <View style={{ flex: 1, backgroundColor:'white'}}>
        {this.renderAddressHeader()}
        {this.renderSellerList()}
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
