import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import {
  View,
  FlatList,
  Text,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  BackHandler
} from 'react-native';
// import { Circle } from 'react-native-progress';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  fetchNearbySellers,
  selectSeller
} from '../../../actions';
import {
  BackButton
} from '../../_common';

// findStoresForLocation,
// setSelectedSeller,
// setBaskets,
// setArea,
//
// setLocale,
// submitOrderSubstitutions,
// markOrderComplete,
// getContacts


// import { statusBarMargin, isAndroid, strings, padNumberZeros, checkIfOpen, localizeDN } from '../../Helpers.js';
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

  componentDidMount() {
    console.log('Store Select mounted')
    const { point } = this.props;
    this.props.fetchNearbySellers(point); // load nearby stores upon open
  }

  componentDidUpdate(prevProps) {
    const { point } = this.props;
    if (point !== prevProps.point) {
      this.props.fetchNearbySellers(point); // load nearby stores upon change
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



//
//
//   getHour(timestamp) {
//     let hour = timestamp / (60 * 60 * 1000);
//     let ampm = 'م'; // 'pm'
//     ampm = 'pm';
//     if (hour % 24 < 12) {
//       ampm = 'ص';
//       ampm = 'am';
//     } // am
//     hour = hour % 12;
//     if (hour === 0) hour = 12;
//     return `${hour}${ampm}`;
//   }
//
//
//   renderHoursBanner(hours) {
//     const isOpen = checkIfOpen(hours);
//     const backgroundColor = isOpen ? '#02CF4CBF' : '#ff0c00BF';
//     const title = isOpen ? 'OPEN' : 'CLOSED';
//
//
//     let subtitle = isOpen ? `${this.getHour(hours.start)} - ${this.getHour(hours.end)}` : `Opens ${this.getHour(hours.start)}`;
//     if (hours.start === 0 && hours.end % 86400000 === 0) { subtitle = '24/7'; }
//     return (
//       <View
//         style={{
//           position: 'absolute',
//           right: 0,
//           top: 0,
//           backgroundColor,
//           width: 250, height: 50,
//           shadowColor: '#000',
//           shadowOffset: { width: 0, height: 2 },
//           shadowOpacity: 0.2,
//           shadowRadius: 3,
//           borderRadius: 10,
//           elevation: 2,
//           paddingLeft: 36,
//           justifyContent: 'center',
//           alignItems: 'center',
//           transform: [{ rotate: '25deg'}, {translateX: 40 }, {translateY: -14 }]
//         }}
//       >
//         <Text style={{
//           color: 'white',
//           fontSize: 21,
//           fontFamily: 'BahijJanna-Bold',
//           height: 24,
//           lineHeight: 28
//         }}>{title}</Text>
//         <Text style={{
//           color: 'white',
//           fontSize: 18,
//           fontFamily: 'BahijJanna',
//           height: 20,
//           lineHeight: 22
//         }}>{subtitle}</Text>
//       </View>
//     )
//   }
//
//   renderItem({ item, index }) {
//     const seller = item;
//
//     const badges = seller.badges || [];
//     let badgeComponents = badges.map(badge => this.renderBadge(badge));
//
//     // each badge is 60px high, give it 65 px per
//     const numBadgesFit = Math.floor(this.state.badgeAreaHeight/65)
//     badgeComponents = badgeComponents.slice(0, numBadgesFit);
//
//     return (
//       <TouchableOpacity
//         style={{
//           flex: 1,
//           backgroundColor: 'white',
//           width: 240,
//           marginTop: 10,
//           shadowColor: '#000',
//           shadowOffset: { width: 0, height: 5 },
//           shadowOpacity: 0.2,
//           shadowRadius: 10,
//           borderRadius: 8,
//           borderColor: '#f2f2f2',
//           borderWidth: (isAndroid ? 2 : 0)
//         }}
//         activeOpacity={0.8}
//         onPress={this.onSellerEnter.bind(this, seller, index)}
//       >
//         <View style={{
//           flex: 1,
//           borderRadius: 8,
//           overflow: 'hidden'
//         }}>
//           <CachedImage
//             style={{
//               width: 240,
//               height: 240
//             }}
//             resizeMode={'cover'}
//             source={{ uri: seller.logo_url, cache: 'force-cache' }}
//           />
//
//           { this.renderHoursBanner(seller.hours) }
//
//           <View style={{ flex: 1, alignItems: 'stretch'}}>
//             <View style={{ height: 1, backgroundColor: '#f7f7f7'}} />
//             { this.renderStars(seller.num_stars || 0) }
//             <View
//               style={{
//                 flex: 1,
//                 marginTop: 14,
//                 marginBottom: 10,
//                 backgroundColor: 'transparent',
//                 justifyContent: 'space-around',
//                 alignItems: 'stretch'
//               }}
//               onLayout={(event) => this.setState({ badgeAreaHeight: event.nativeEvent.layout.height })}
//             >
//             { badgeComponents }
//             </View>
//           </View>
//
//           <View style={{
//             height: 50,
//             justifyContent: 'center',
//             alignItems: 'center',
//             backgroundColor: '#0094ff'
//           }}>
//             <Text style={{
//               fontSize: 20,
//               fontFamily: 'BahijJanna-Bold',
//               color: 'white'
//             }}>{strings('StoreSelector.select')}</Text>
//           </View>
//         </View>
//
//         <View style={{
//           shadowColor: '#000',
//           shadowOffset: { width: 0, height: 2 },
//           shadowOpacity: 0.2,
//           shadowRadius: 3,
//           borderRadius: 10,
//           elevation: 2,
//           height: 40,
//           justifyContent: 'center',
//           alignItems: 'center',
//           position: 'absolute',
//           width: 180,
//           top: 224,
//           left: 30,
//           flexDirection: 'row',
//           backgroundColor: '#FFFBD6'
//         }}>
//           <Text style={{
//             fontSize: 21,
//             fontFamily: 'BahijJanna-Bold',
//             color: 'black'
//           }}>{seller.delivery_time}min</Text>
//           <Image
//             style={{
//               width: 50,
//               height: 50,
//               marginLeft: 10
//             }}
//             resizeMode={'contain'}
//             source={deliveryTruckIcon}
//           />
//         </View>
//       </TouchableOpacity>
//     )
//   }
//
//   //
//   // renderItem({ item, index }) {
//   //   const seller = item;
//   //
//   //   return (
//   //     <View style={{
//   //       flex: 1,
//   //       backgroundColor: 'transparent',
//   //       width: window.width-100,
//   //       paddingLeft: (window.width-100-200)/2,
//   //       justifyContent: 'center'
//   //     }}>
//   //
//   //       <View
//   //         style={{
//   //           width: 200,
//   //           height: 200,
//   //           borderRadius: 12,
//   //           backgroundColor: 'white',
//   //           shadowColor: '#000',
//   //           shadowOffset: { width: 0, height: 5 },
//   //           shadowOpacity: 0.2,
//   //           shadowRadius: 10,
//   //           elevation: 6,
//   //         }}
//   //       >
//   //         <CachedImage
//   //           style={{
//   //             width: 200,
//   //             height: 200,
//   //             borderRadius: 12
//   //           }}
//   //           resizeMode={'cover'}
//   //           source={{ uri: seller.logo_url, cache: 'force-cache' }}
//   //         />
//   //       </View>
//   //
//   //       <BlockButton
//   //         text={strings('StoreSelector.select')}
//   //         style={{ width: 200, marginLeft: 0, marginTop: 24 }}
//   //         onPress={this.onSellerEnter.bind(this, seller)}
//   //       />
//   //
//   //     </View>
//   //   )
//   // }
//
//
// renderCarousel() {
//
//   // when data is loading
//   if (this.props.isLoading || !this.props.area.id) { //  || (!this.props.area.id)
//
//     // if a modal is opened, show nothing (modal will show loading)
//     // if (this.state.locationConfirmModal) {
//     //   return (<View style={{ flex: 1 }} />);
//     // }
//
//
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Circle
//           color={'#20C74B'}
//           indeterminate
//           borderWidth={2}
//           size={40}
//         />
//       </View>
//     );
//   }
//
//
//   // when no items AFTER loaded, show Coming Soon
//   if (this.props.fetched_sellers.length === 0) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text style={styles.noStoresText}>{strings('StoreSelector.noStores')}</Text>
//       </View>
//     );
//   }
//
//   const { currentIndex } = this.state;
//   const currentSeller = this.props.fetched_sellers[currentIndex];
//   const isFirst = (currentIndex === 0);
//   const isLast = (this.props.fetched_sellers.length-1 === currentIndex);
//
//   return (
//     <View style={{ flex: 1 }}>
//       <Carousel
//          ref={(c) => { this._carousel = c; }}
//          data={this.props.fetched_sellers}
//          containerCustomStyle={{ overflow: 'visible'}}
//          renderItem={this.renderItem.bind(this)}
//          sliderWidth={window.width}
//          itemWidth={240}
//          layout={'default'}
//          onSnapToItem={(currentIndex) => this.setState({ currentIndex })}
//        />
//       <View style={{
//           height: 70,
//           flexDirection: 'row',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           backgroundColor: 'transparent'
//         }}>
//
//
//         <TouchableOpacity
//            onPress={() => { this._carousel.snapToPrev(); }}
//          >
//           <Image
//             style={{
//               width: 50,
//               height: 50,
//               margin: 10,
//               transform: [{ rotate: '180deg' }]
//             }}
//             opacity={isFirst ? 0.2 : 1}
//             resizeMode={'contain'}
//             source={arrowCircle}
//           />
//         </TouchableOpacity>
//
//
//         <View style={{
//           shadowColor: '#000',
//           shadowOffset: { width: 0, height: 2 },
//           shadowOpacity: 0.2,
//           shadowRadius: 3,
//           borderRadius: 20,
//           elevation: 2,
//           height: 32,
//           justifyContent: 'center',
//           paddingLeft: 20,
//           paddingRight: 20,
//           backgroundColor: 'white'
//         }}>
//           <Text style={{
//             fontSize: 18,
//             fontFamily: 'BahijJanna-Bold',
//             color: 'black'
//           }}>{localizeDN(currentSeller.display_name)}</Text>
//         </View>
//
//
//
//         <TouchableOpacity
//            onPress={() => { this._carousel.snapToNext(); }}
//          >
//           <Image
//             style={{
//               width: 50,
//               height: 50,
//               margin: 10
//             }}
//             opacity={isLast ? 0.2 : 1}
//             resizeMode={'contain'}
//             source={arrowCircle}
//           />
//         </TouchableOpacity>
//
//
//       </View>
//     </View>
//   )
//
// }

// <TouchableOpacity
//    style={[ styles.carouselNavigationOverlay, { left: 0 }]}
//    onPress={() => { this._carousel.snapToPrev(); }}
//  />
// <TouchableOpacity
//   style={[ styles.carouselNavigationOverlay, { right: 0 }]}
//   onPress={() => { this._carousel.snapToNext(); }}
// />


// make reusable containers: Page, Text

// Actions.addressSelect();

renderItem({ item, index }) {
    return (
      <TouchableOpacity onPress={this.onSelectSeller.bind(this, item)}>
        <Text>{item.id} - {item.stars} - {item.index}</Text>
      </TouchableOpacity>
    );
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
        <TouchableOpacity
          onPress={this.onAddressSelect.bind(this)}
          style={{ marginTop: 46 }}
          >
          <Text>Address</Text>
        </TouchableOpacity>

        <FlatList
          data={this.props.sellers}
          renderItem={this.renderItem.bind(this)}
            style={{ marginTop: 46, flex: 1, backgroundColor: '#f7f7f7' }}

            removeClippedSubviews
            ListHeaderComponent={null}
            ListEmptyComponent={null}
            ListFooterComponent={null}


            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index}
          />
          <BackButton type='cross_circled' />
      </View>
    );
  }
}


// <SoftConfirmModal
//   onClose={() => this.setState({ locationConfirmModal: false }) }
//   visible={this.state.locationConfirmModal}
// />



// const styles = {
//   titleText: {
//     marginTop: 5,
//     textAlign: 'center',
//     fontFamily: 'BahijJanna-Bold',
//     fontSize: 22,
//     color: 'black'
//   },
//
//   noStoresText: {
//     fontFamily: 'BahijJanna',
//     fontSize: 22,
//     color: 'black'
//   },
//
//   carouselNavigationOverlay: {
//     position: 'absolute',
//     width: 40,
//     top: 0,
//     bottom: 0,
//     backgroundColor: 'transparent'
//   }
// };

const mapStateToProps = ({ Address, SellerSearch }) => {
  const { street, point } = Address;
  const { sellers, is_loading } = SellerSearch;
  return {
    street,
    point,

    sellers,
    is_loading
  };
};

export default connect(mapStateToProps, {
  fetchNearbySellers,
  selectSeller
})(StoreSelect);
