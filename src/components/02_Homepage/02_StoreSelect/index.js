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
  AYEZ_GREEN
} from '../../../Helpers';

import {
  strings,
  translate,
  formatCurrency,
  formatDay,
  formatTimestamp
} from '../../../i18n.js';

const star_icon = require('../../../../assets/images_v2/Common/star.png');

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
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
    const { address } = this.props;

    if (address) {
      this.props.fetchNearbySellers(address); // load nearby stores upon open
    }
  }

  componentDidMount() {
    console.log('Store Select mounted')
    this.fetchNearbySellers();
  }

  componentDidUpdate(prevProps) {
    if (this.props.address !== prevProps.address) {
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
        lineHeight: 16,
        textAlign: 'center'
      }}>{strings('StoreSelect.deliveringTo')}</AyezText>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        paddingTop: 3,
        paddingBottom: 4
      }}>
        <AyezText
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          numberOfLines={1}
          semibold style={{
            maxWidth: SCREEN_WIDTH - 100,
            color: 'black',
            fontSize: (Platform.OS === 'android') ? 22 : 28,
            textAlign: 'center'
        }}>{this.props.street || '-'}</AyezText>

        <AyezText regular style={{
          color: '#0094ff',
          marginTop: 4,
          fontSize: 13,
          lineHeight: 16,
          marginLeft: 8,
        }}>({strings('Common.edit')})</AyezText>
      </View>
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

renderNoAddress() {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <AyezText regular style={{
        color: '#8E8E93',
        fontSize: 16,
        width: 240,
        margin: 20
      }}>{strings('AddressCreate.addressSearchInstruction')}</AyezText>
      <BlockButton
        text={strings('Common.OK')}
        color={'#0094ff'}
        style={{ width: 200 }}
        onPress={() => Actions.addressCreate()}
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
        key={'NONE'}
        style={{ paddingHorizontal: 8 }}
        activeOpacity={0.8}
        onPress={this.onSelectSeller.bind(this, item)}
        >
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
          key={url}
          style={{ paddingHorizontal: 8 }}
          activeOpacity={0.8}
          onPress={this.onSelectSeller.bind(this, item)}
          style={{ paddingHorizontal: 8 }}>
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

  const isAndroidRTL = (Platform.OS === 'android') && (I18nManager.isRTL);
  if (isAndroidRTL) { imageComponents = imageComponents.reverse(); }

  return (
    <ViewPager
      style={{ height: SCREEN_WIDTH*3/8 }}
      pageMargin={-4}
      initialPage={isAndroidRTL ? imageComponents.length - 1 : 0}
      >
      {imageComponents}
    </ViewPager>
  )
}

renderItem({ item, index }) {
  let nextTimeslotText = '-';
  if (item.next_timeslot) {
    const { start, end } = item.next_timeslot;
    nextTimeslotText = `${formatDay(start)}, ${formatTimestamp(start, "h:mmA")}-${formatTimestamp(end, "h:mmA")}`
  }
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: 16,
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
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AyezText semibold style={{
                fontSize: 15,
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
              {(item.num_reviews) ? (
                <AyezText extralight style={styles.storeDetailText}>{strings('StoreSelect.numRatings', {num_reviews: item.num_reviews})}</AyezText>
              ) : null }
            </View>
            <AyezText extralight style={styles.storeDetailText}>{strings('StoreSelect.minTotal', {min: formatCurrency(item.minimum)})}</AyezText>
          </View>

          <View style={{ alignItems: 'flex-end'}}>
            <AyezText extralight style={styles.storeDetailText}>{strings('StoreSelect.nextDelivery')}</AyezText>
            <AyezText medium size={13} color={AYEZ_GREEN}>{nextTimeslotText}</AyezText>
          </View>
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
  if (!this.props.address) {
    return this.renderNoAddress();
  }

  if (this.props.sellers.length === 0) {
    return (
      <View>
        <AyezText medium style={{ marginTop: 40, marginBottom: 100, textAlign: 'center' }}>
          {strings('Common.comingSoon')}
        </AyezText>
      </View>
    )
  } else if (this.props.sellers.length === 1) {
    const seller = this.props.sellers[0];
    const banner_image = (seller.banner_images && seller.banner_images.length) ? seller.banner_images[0] : null;
    let nextTimeslotText = '-';
    if (seller.next_timeslot) {
      const { start, end } = seller.next_timeslot;
      nextTimeslotText = `${formatDay(start)}, ${formatTimestamp(start, "h:mmA")}-${formatTimestamp(end, "h:mmA")}`
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 16,
        }}
        >

        <AyezText medium>{'3ayez delivers to your area!'}</AyezText>


        <TouchableOpacity
          activeOpacity={0.7}
          onPress={this.onSelectSeller.bind(this, seller)}
          style={{
            backgroundColor: 'white',
            marginVertical: 10,
            shadowColor: '#000',
            shadowOffset: { width: -1, height: 3 },
            shadowOpacity: 0.14,
            shadowRadius: 8,
            elevation: 2
          }}
          >
            <Image
              source={{ uri: seller.logo_url }}
              resizeMode={'contain'}
              style={{
                width: SCREEN_WIDTH/3,
                height: SCREEN_WIDTH/3,
                borderRadius: 10
              }}
            />
        </TouchableOpacity>

        <AyezText regular style={{
          fontSize: 16,
        }}>{translate(seller.display_name).toUpperCase()}</AyezText>
        <AyezText medium size={13} color={AYEZ_GREEN}>{nextTimeslotText}</AyezText>


        <BlockButton
          text={'ENTER'}
          style={{ width: 200, marginTop: 10 }}
          onPress={this.onSelectSeller.bind(this, seller)}
          />

        { (SCREEN_HEIGHT > 700) ? (
            <Image
              source={{ uri: banner_image }}
              resizeMode={'cover'}
              style={{
                alignSelf: 'stretch',
                marginTop: 24,
                height: SCREEN_WIDTH/2
              }}
            />
          ) : null }
      </View>
    )
  }

  return (
    <FlatList
      data={this.props.sellers}
      renderItem={this.renderItem.bind(this)}
      style={{ flex: 1 }}

      removeClippedSubviews
      ListHeaderComponent={null}
      ListFooterComponent={null}

      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => `${index}`}
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
    fontSize: 13,
    color: '#8E8E93'
  }
};

const mapStateToProps = ({ Addresses, SellerSearch }) => {
  const { addresses, address } = Addresses;

  const street = address ? address.street : null;

  const { sellers, is_loading, error } = SellerSearch;
  return {
    address,
    street,

    sellers,
    is_loading,
    error
  };
};

export default connect(mapStateToProps, {
  fetchNearbySellers,
  selectSeller
})(StoreSelect);
