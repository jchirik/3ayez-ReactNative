import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { Bar } from 'react-native-progress';

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


import {
  fetchNearbySellers,
  selectSeller
} from '../../actions';
import {
  BackButton,
  BlockButton,
  AyezText
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


import images from '../../theme/images'
import { sceneKeys, navigateTo } from '../../router';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class StoreSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loadingPriceAnimation: false,
      animationProgress: 0,
      animationBackgroundFade: new Animated.Value(0)
    };
  }

  fetchNearbySellers() {
    const { address } = this.props;
    if (address) {
      this.setState({
        loadingPriceAnimation: false,
        animationProgress: 0,
        animationBackgroundFade: new Animated.Value(0)
      });
      this.props.fetchNearbySellers(address); // load nearby stores upon open
    }
  }

  componentDidMount() {
    console.log('Store Select mounted')
    this.fetchNearbySellers();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.address !== prevProps.address) {
      this.fetchNearbySellers(); // load nearby stores upon change
    }

    // animations if only store option
    if (this.props.sellers.length === 1) {
      if (!this.props.is_loading && prevProps.is_loading) {
        console.log('begin price loading animation')
        this.setState({ loadingPriceAnimation: true });
        Animated.timing(
          this.state.animationBackgroundFade,
          {
            toValue: 1,
            duration: 250,
          }
        ).start();
        setTimeout(() => {
          this.setState({ animationProgress: 0.3 })
        }, 500);
        setTimeout(() => {
          this.setState({ animationProgress: 0.5 })
        }, 1000);
        setTimeout(() => {
          this.setState({ animationProgress: 0.8 })
        }, 1800);
        setTimeout(() => {
          this.setState({ animationProgress: 1 })
        }, 2300);
        setTimeout(() => {
          this.onSelectSeller(this.props.sellers[0])
        }, 2400);
      }
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
        onPress={() => {
          navigateTo(sceneKeys.addressCreate)
        }}
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

// <AyezText regular style={{
//   fontSize: 16,
// }}>{translate(item.display_name).toUpperCase()}</AyezText>


renderSellerTypeBadge(type) {
  let text = strings('StoreSelect.express').toUpperCase();
  let color = '#0094ff'

  if (type === 'HYPER') {
    text = strings('StoreSelect.hypermarket').toUpperCase();
    color = '#BA67FF'
  }

  return (
    <View style={{
      borderWidth: 1,
      borderColor: color,
      paddingHorizontal: 10,
      paddingTop: 1,
      borderRadius: 20,
      marginBottom: 5
    }}>
      <AyezText regular color={color} size={10}>{text}</AyezText>
    </View>
  )
}

renderSellerDeliveryTime(seller) {

  if (seller.type === 'HYPER') {
    let nextTimeslotText = '-';
    if (seller.next_timeslot) {
      const { start, end } = seller.next_timeslot;
      nextTimeslotText = `${formatDay(start)}, ${formatTimestamp(start, "h:mmA")}-${formatTimestamp(end, "h:mmA")}`
    }
    return (
      <View style={{ alignItems: 'flex-end'}}>
        <AyezText extralight style={styles.storeDetailText}>{strings('StoreSelect.nextDelivery')}</AyezText>
        <AyezText medium size={13} color={AYEZ_GREEN}>{nextTimeslotText}</AyezText>
      </View>
    );
  }


  let isOpen = checkIfOpen(seller.hours);

  let hoursText = '-';
  if (seller.hours && (seller.hours.start >= 0)) {
    const { start, end } = seller.todays_hours;
    hoursText = strings('StoreSelect.openHours', { start: formatTimestamp(start, "h:mmA"), end: formatTimestamp(end, "h:mmA") });
  }

  return (
    <View style={{ alignItems: 'flex-end'}}>
      <AyezText extralight style={styles.storeDetailText}>{hoursText}</AyezText>
      <AyezText medium size={13} color={isOpen ? AYEZ_GREEN : 'red'}>{isOpen ? strings('StoreSelect.orderNow') : strings('StoreSelect.closed')}</AyezText>
    </View>
  );
}

renderItem({ item, index }) {

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
        style={{ marginHorizontal: 8 }}
        onPress={this.onSelectSeller.bind(this, item)}>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10
        }}>
          <Image
            source={{ uri: item.logo_url }}
            resizeMode={'contain'}
            style={{
              width: 135,
              height: 45
            }}
          />

          <View style={{
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}>
            { this.renderSellerTypeBadge(item.type) }
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <AyezText normal size={13}>{translate(item.location_text) || '-'}</AyezText>
              <Image
                source={images.storeLocationPin}
                style={{
                  width: 14,
                  height: 14,
                  marginLeft: 2
                }}
                resizeMode={'contain'}
              />
            </View>
          </View>




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
                source={images.starIcon}
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

          { this.renderSellerDeliveryTime(item) }
        </View>
      </TouchableOpacity>
    </View>
  );
}


renderLoadingStore() {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <AyezText medium>Finding the provider for your address</AyezText>
      <ActivityIndicator size="small" style={{ marginTop: 10 }} />
    </View>
  )
}

renderLoadingBestPrices(seller) {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Animated.View style={{
        position: 'absolute',
        opacity: this.state.animationBackgroundFade,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: seller.color || AYEZ_GREEN,
      }} />
      <View style={{
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#cecece',
        marginBottom: 20,
        backgroundColor: 'white'
      }}>
        <Image
          source={{ uri: seller.logo_url }}
          resizeMode={'contain'}
          style={{
            width: 180,
            height: 60,
            marginVertical: 12,
            marginHorizontal: 20
          }}
        />
      </View>
      <AyezText medium color={'white'}>Getting up to date prices</AyezText>

      <Bar
        style={{ marginTop: 10 }}
        color={'white'}
        useNativeDriver
        progress={this.state.animationProgress}
        width={200}
      />
    </View>
  )
}



renderSellerList() {

  if (this.props.is_loading) {
    return this.renderLoadingStore();
  }

  if (this.props.error) {
    return this.renderNoInternetConnection();
  }
  if (!this.props.address) {
    return this.renderNoAddress();
  }

  if (this.props.sellers.length === 0) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: AYEZ_BACKGROUND_COLOR,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <AyezText medium style={{ marginTop: 40, textAlign: 'center' }}>
          We're not in this area yet 😥
        </AyezText>
        <BlockButton
          text={'Find another location'}
          color={'#0094ff'}
          style={{ width: 250, marginTop: 20 }}
          onPress={() => {
            navigateTo(sceneKeys.locationSelect)
          }}
        />
      </View>
    )
  } else if (this.props.sellers.length === 1) {
    const seller = this.props.sellers[0];
    return this.renderLoadingBestPrices(seller);
  }

  return (
    <FlatList
      data={this.props.sellers}
      renderItem={this.renderItem.bind(this)}
      style={{ flex: 1, backgroundColor: AYEZ_BACKGROUND_COLOR }}
      removeClippedSubviews
      ListHeaderComponent={
        <View style={{
          marginTop: STATUS_BAR_HEIGHT + 16,
          marginBottom: 6,
          alignItems: 'center'
        }}>
          <AyezText medium size={18}>Please select your store</AyezText>
        </View>
      }
      ListFooterComponent={null}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => `${index}`}
    />
  )
}

  render() {
    return (
      <View style={{ flex: 1 }}>
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
    fontSize: 13,
    color: '#8E8E93'
  }
};

const mapStateToProps = ({ Addresses, SellerSearch }) => {
  const { addresses, address } = Addresses;

  const street = address ? address.street : null;

  const {
    sellers,
    is_loading,
    error
  } = SellerSearch;

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
