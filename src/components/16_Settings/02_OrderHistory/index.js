import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SectionList,
  Platform,
  BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import {
  strings,
  translate,
  formatTimestamp,
  formatDay
} from '../../../i18n.js';

import {
  formatStatusText
} from '../../../Helpers.js';


import {
  fetchOrderHistory
} from '../../../actions';

import {
  Header,
  AyezText
} from '../../_common';


class OrderHistory extends Component {

  componentDidMount() {
    this.props.fetchOrderHistory();
    // BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  componentWillUnmount() {
    // this.props.endListeningOrderHistory();
    // BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
  }


  // onAndroidBackPress = () => {
  //   Actions.popTo('storeCategories'); // Android back press
  //   return true;
  // }



  onSelectOrder(order) {
    Actions.orderTracker({ order_id: order.id });
  }


//
//
//   callStore(seller) {
//       call({ number: seller.phone, prompt: false });
//     }
//
//   renderOrderNumber(order) {
//     if ('order_number' in order) {
//       return `ORDER #${order.order_number}`;
//     }
//     return 'ORDER -';
//   }
//
//
//   markCancelled(order) {
//     firebase.firestore().collection('orders').doc(order.id).update({
//       status: 300
//     });
//   }
//
// renderStatus(order) {
//   const stat0text = 'تم إرسال السوبرماركت'; // sent
//   const stat50text = 'تم استلام الطلب'; // received
//   const stat100text = 'خرج للتوصيل'; // delivered
//   const stat300text = 'تم إلغاء الطلب ❌'; //cancelled
//
//   let statusText = '';
//
//
//   if (order.status === 300) {
//     return (
//       <View style={{marginTop: 7, marginBottom: 14}}>
//         <Text style={styles.statusTextStyle}>{stat300text}</Text>
//       </View>
//     );
//   }
//
//   if (order.status === 400) {
//     let stat400header = 'Cancelled by Store';
//     let stat400detail = null;
//     if (order.issue) {
//       stat400header = order.issue.header;
//       stat400detail = order.issue.detail;
//     }
//
//     return (
//       <View style={{
//         marginTop: 7,
//         marginBottom: 14,
//         flexDirection: 'row',
//         alignItems: 'center'
//       }}>
//         <Image
//           source={dangerIcon}
//           style={{ width: 36, height: 36, marginLeft: 20, marginRight: 20 }}
//           />
//         <View style={{
//           flex: 1
//         }}>
//           <Text style={styles.statusTextStyle}>{stat400header}</Text>
//           { stat400detail ? (
//             <Text style={styles.statusSubtextStyle}>{stat400detail}</Text>
//           ) : null }
//         </View>
//       </View>
//     );
//   }
//
//
//   if (order.status === 0) {
//     statusText = stat0text;
//   } else if (order.status === 50) {
//     statusText = stat50text;
//   } else if (order.status === 100) {
//     statusText = stat100text;
//   }
//
//   const stat50opacity = (order.status >= 50) ? 1 : 0.2;
//   const stat100opacity = (order.status >= 100) ? 1 : 0.2;
//
//   return (
//     <View style={{
//       marginBottom: 7,
//       marginTop: 5
//     }}>
//     <Text style={styles.statusTextStyle}>{statusText}</Text>
//     <View style={{
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginTop: 6,
//       marginRight: 20,
//       marginLeft: 20,
//       marginBottom: 10,
//       alignSelf: 'stretch'
//     }}>
//     <Image
//         source={stat100Icon}
//         style={[styles.statIconStyle, {opacity: stat100opacity}]}
//     />
//     <View style={[styles.dotStyle, {opacity: stat100opacity}]} />
//     <View style={[styles.dotStyle, {opacity: stat100opacity}]} />
//     <View style={[styles.dotStyle, {opacity: stat100opacity}]} />
//       <Image
//           source={stat50Icon}
//           style={[styles.statIconStyle, {opacity: stat50opacity}]}
//       />
//       <View style={[styles.dotStyle, {opacity: stat50opacity}]} />
//       <View style={[styles.dotStyle, {opacity: stat50opacity}]} />
//       <View style={[styles.dotStyle, {opacity: stat50opacity}]} />
//       <Image
//           source={stat0Icon}
//           style={styles.statIconStyle}
//       />
//     </View>
//     </View>
//   );
// }
//
//
// renderItem({ item, index }) {
//   return (
//     <ItemCell item={item} />
//   );
// }
//
//   renderAddress(address) {
//     if (!address) {
//       return (null);
//     }
//
//     return (
//       <View
//       style={{
//         backgroundColor: '#F9F9F9',
//         borderBottomWidth: 1,
//         borderTopWidth: 1,
//         borderColor: '#E9E9E9',
//         padding: 14,
//         paddingTop: 10,
//         paddingBottom: 10
//       }}
//       >
//       <AddressDetail address={address} />
//       </View>
//     );
//   }
//
//   renderCallButton(buttonColor) {
//     return (
//       <TouchableOpacity
//       style={{
//         position: 'absolute',
//         top: statusBarMargin+5,
//         left: 15,
//         borderRadius: 30,
//         paddingTop: 3,
//         paddingBottom: 3,
//         paddingLeft: 20,
//         paddingRight: 20,
//         backgroundColor: buttonColor,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2},
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 2,
//       }}
//       activeOpacity={0.6}
//       onPress={this.callStore.bind(this, this.props.seller)}
//       >
//       <Text
//         style={{
//           color: '#fff',
//           fontSize: 15,
//           fontFamily: 'BahijJanna-Bold'
//         }}
//       >{callStoreText}</Text>
//       </TouchableOpacity>
//     );
//   }
//
//
//   renderCancelButton(order, buttonColor) {
//     return (
//       <TouchableOpacity
//       style={{
//         position: 'absolute',
//         top: statusBarMargin + 45,
//         left: 15,
//         borderRadius: 30,
//         paddingTop: 3,
//         paddingBottom: 3,
//         paddingLeft: 20,
//         paddingRight: 20,
//         backgroundColor: buttonColor,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 2,
//       }}
//       activeOpacity={0.6}
//       onPress={this.markCancelled.bind(this, order)}
//       >
//       <Text
//       style={{
//         color: '#FFC6AA',
//         fontSize: 15,
//         fontFamily: 'BahijJanna-Bold'
//       }}
//       >{cancelOrderText}</Text>
//       </TouchableOpacity>
//     );
//   }
//
//
//   renderTotalPriceBar() {
//
//     // totalPrice, originalPrice, priceIsTentative, basketQuantity
//
//     const { items_array, coupon } = this.props.order;
//
//     const orderTotalT = orderTotal(items_array, coupon);
//     const originalOrderTotalT = originalOrderTotal(items_array);
//     const containsUnpricedT = containsUnpriced(items_array);
//     const basketQuantityT = basketQuantity(items_array);
//
//     return (
//       <View style={{flexDirection: 'row',
//       justifyContent: 'space-between',
//     backgroundColor: 'rgba(0, 0, 0, 0.15)',
//     paddingRight: 20,
//     paddingLeft: 20
//   }}>
//       {/* basket quantity */}
//       <View style={{
//         backgroundColor: 'rgba(0, 0, 0, 0.1)'
//       }}
//       >
//       <Text style={{
//         textAlign: 'center',
//         color: '#fff',
//         fontSize: 20,
//         paddingLeft: 6,
//         paddingRight: 6,
//         fontFamily: 'BahijJanna-Bold'
//       }}
//         >
//         {basketQuantityT}
//         </Text>
//       </View>
//
//       {/* original price */}
//       <View style={{
//         backgroundColor: 'transparent',
//         flexDirection: 'row'
//       }}>
//       {(orderTotalT === originalOrderTotalT) ? null : (
//         <Text
//         style={{
//           fontSize: 20,
//           color: 'white',
//           fontFamily: 'BahijJanna',
//           textDecorationLine: 'line-through',
//           textDecorationStyle: 'solid',
//           marginRight: 8
//         }}
//         >{originalOrderTotalT.toFixed(2)}
//         </Text>
//       )}
//
//       {/* total price */}
//       <Text
//       style={{
//         fontSize: 20,
//         color: 'white',
//         fontFamily: 'BahijJanna-Bold',
//       }}
//       >{`${orderTotalT.toFixed(2)}${(containsUnpricedT ? '*' : '')} LE`}
//       </Text>
//       </View>
//     </View>
//   );
//   }
//
//
//
//
//
//
//   renderFooter() {
//     return (
//       <View style={{marginBottom: 20, marginTop: 10 }}>
//         <Text style={styles.notesTextStyle}>{this.props.notes}</Text>
//       </View>
//     );
//   }
//   // <CouponBanner coupon={this.props.order.coupon} />
//
//
//   //{this.renderOrderField()}
//
//
//   renderHeader() {
//
//     const { order } = this.props;
//     const date = new Date(order.timestamp);
//     const dateString = Moment(date).format('D/M/YY h:mma');
//
//     return (
//       <View style={{flexDirection: 'column'}}>
//         <View style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: 8,
//           marginLeft: 12,
//           marginRight: 12,
//           marginTop: 10
//         }}>
//         <Text style={{
//           fontFamily: 'BahijJanna',
//           lineHeight: (Platform.OS === 'ios') ? 22 : 15,
//           height: 20,
//           fontSize: 17,
//           marginBottom: 2,
//           backgroundColor: 'transparent',
//           color: 'black'
//         }}>{dateString}</Text>
//         <Text style={{
//           fontFamily: 'BahijJanna-Bold',
//           lineHeight: (Platform.OS === 'ios') ? 22 : 14,
//           backgroundColor: 'transparent',
//           height: 16,
//           fontSize: 17,
//           color: 'black'
//         }}>{this.renderOrderNumber(order)}</Text>
//       </View>
//
//         {this.renderAddress(order.address)}
//       </View>
//     );
//   }
//
//
// renderDriverLocation() {
//
//   const { driver_id, driver_location, rotation } = this.props;
//
//   if (!driver_id) {
//     return (
//       <View style={{ backgroundColor: 'white', height: 100, marginTop: statusBarMargin }}>
//         <Text>Driver not assigned, please check back later</Text>
//       </View>
//     );
//   }
//
//   if (!driver_location) {
//     return (
//       <View style={{ backgroundColor: 'white', height: 100, marginTop: statusBarMargin }}>
//         <Text>No driver information available</Text>
//       </View>
//     );
//   }
//
//   const carImage = (
//     <Image source={carIcon} style={{ width: 40, height: 20 }} />
//   );
//
//   return (
//     <MapView
//       ref={map => { this.map = map }}
//       style={{ height: 200 + statusBarMargin }}
//       showsUserLocation
//       provider={PROVIDER_GOOGLE}
//       initialRegion={{
//         latitude: driver_location.lat,
//         longitude: driver_location.lng,
//         latitudeDelta: 0.005,
//         longitudeDelta: 0.005,
//       }}
//     >
//       <Marker
//       coordinate={driver_location}
//       rotation={rotation}
//       >{carImage}</Marker>
//     </MapView>
//   );
// }
//


  renderItem({item, index, section}) {
    const order = item;

    let timeString = '';
    if (order.timeslot && order.timeslot.start) {
      if (order.status >= 200) {
        timeString = formatDay(order.timeslot.start)
      } else {
        timeString = `${formatDay(order.timeslot.start)}, ${formatTimestamp(order.timeslot.start, 'h:mm')} - ${formatTimestamp(order.timeslot.end, 'h:mm A')}`;
      }
    } else {
      timeString = `${formatDay(order.timestamp)}, ${formatTimestamp(order.timestamp, 'h:mm A')}`;
    }


    let statusText = formatStatusText(order.status, order.is_timeslot_ongoing, order.timeslot);
    let statusColor = '#0094ff';
    if (order.status === 200) {
      statusColor = '#45CA00';
    } else if (order.status === 300) {
      statusColor = '#cecece';
    } else if (order.status >= 400) {
      statusColor = '#E80000';
    }

    return (
      <TouchableOpacity
        onPress={this.onSelectOrder.bind(this, order)}
        style={styles.orderContainer}
      >

        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', marginLeft: 18}}>
          <AyezText regular style={styles.orderNumber}>{translate(order.seller.display_name)}</AyezText>
          <AyezText regular style={styles.orderTime}>{timeString}</AyezText>
          <AyezText regular style={[ styles.orderStatus, { color: statusColor }]}>{statusText}</AyezText>
        </View>

      </TouchableOpacity>
    );
  }

  renderSectionHeader({ section }) {
    return (
      <View style={styles.sectionHeaderContainer}>
        <AyezText bold style={styles.sectionHeaderText}>{section.title}</AyezText>
      </View>
    );
  }

  render() {

    const {
      sectionedOrders,
      loading
    } = this.props;

    let mainList = (
      <SectionList
        style={{ flex: 1 }}
        removeClippedSubviews
        renderItem={this.renderItem.bind(this)}
        renderSectionHeader={this.renderSectionHeader.bind(this)}
        sections={sectionedOrders}
        keyExtractor={(item, index) => index}
      />
    );

    if (loading) {
      mainList = (
        <ActivityIndicator size="small" style={{ flex: 1 }} />
      );
    }

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Header title={strings('OrderHistory.header')} />
        {mainList}
      </View>
    );
  }
}


// ListHeaderComponent={this.renderHeader()}


const styles = {
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#F2F2F2'
  },
  orderNumber: {
    fontSize: 15,
    color: 'black'
  },
  orderTime: {
    fontSize: 15,
    color: 'black'
  },
  orderStatus: {
    fontSize: 15,
    color: 'black'
  },
  sectionHeaderContainer: {
    paddingLeft: 15,
    paddingTop: 10,
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#F2F2F2'
  },
  sectionHeaderText: {
    color: 'black',
    fontSize: 19,
  }
};


const mapStateToProps = ({ OrderHistory }) => {

  const { orders, loading } = OrderHistory;

  const activeOrders = [];
  const inactiveOrders = [];

  orders.forEach(order => {
    // active if status < 200, and it has been up to a day after timeslot start
    if ((order.status < 200) && order.timeslot && ((Date.now() - order.timeslot.start) < 86400000)) {
      activeOrders.push(order);
    } else {
      inactiveOrders.push(order);
    }
  });

  const sectionedOrders = [];
  if (activeOrders.length) {
    sectionedOrders.push({ title: strings('OrderHistory.active'), data: activeOrders })
  }
  if (inactiveOrders.length) {
    sectionedOrders.push({ title: strings('OrderHistory.past'), data: inactiveOrders })
  }

  return {
    sectionedOrders,
    loading
   };
 }

export default connect(mapStateToProps,
  {
    fetchOrderHistory
  }
)(OrderHistory);
