// import React from 'react';
// import {
//   Text,
//   View,
//   Platform
// } from 'react-native';
//
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
//
// const mapDetailStyle = [
//   {
//     "featureType": "administrative.land_parcel",
//     "elementType": "labels",
//     "stylers": [
//       {
//         "visibility": "off"
//       }
//     ]
//   },
//   {
//     "featureType": "poi.business",
//     "stylers": [
//       {
//         "visibility": "off"
//       }
//     ]
//   },
//   {
//     "featureType": "poi.park",
//     "elementType": "labels.text",
//     "stylers": [
//       {
//         "visibility": "off"
//       }
//     ]
//   },
//   {
//     "featureType": "road.local",
//     "elementType": "labels",
//     "stylers": [
//       {
//         "visibility": "off"
//       }
//     ]
//   }
// ];
//
// import { strings } from '../../Helpers.js';
//
//
//
//
// const renderAddressField = (text, label, height) => {
//   if (!text) {
//     return null;
//   }
//   return (
//     <View style={styles.addressTextLayout}>
//       <Text style={{ ...styles.addressText }}>
//         {text}
//       </Text>
//       <Text style={{ ...styles.addressText, marginLeft: 3 }}>
//         {label}
//       </Text>
//     </View>
//   );
// };
//
//
// const AddressDetail = ({ address, height }) => {
//
//
//   let mapView = null;
//
//   if (address.point) {
//     mapView = (
//       <View
//         style={{ width: 120, borderRadius: 5, marginLeft: 10, overflow: 'hidden' }}
//         pointerEvents="none"
//       >
//         <MapView
//           pitchEnabled={false}
//           rotateEnabled={false}
//           scrollEnabled={false}
//           zoomEnabled={false}
//           zoomControlEnabled={false}
//           cacheEnabled
//           ref={map => { this.map = map }}
//           style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: -30 }}
//           liteMode
//           customMapStyle={mapDetailStyle}
//           provider={PROVIDER_GOOGLE}
//           initialRegion={{
//               latitude: address.point.lat,
//               longitude: address.point.lng,
//               latitudeDelta: 0.004,
//               longitudeDelta: 0.004,
//           }}
//         >
//           <Marker
//           coordinate={{
//             latitude: address.point.lat,
//             longitude: address.point.lng
//           }}
//           />
//         </MapView>
//       </View>
//     )
//   }
//
//
//
//   return (
//
//     <View style={{ flex: 1, flexDirection: 'row', alignItems: 'stretch' }}>
//       <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
//
//         <Text
//         numberOfLines={1}
//           style={{ ...styles.streetText }}>
//           {address.street}
//         </Text>
//
//         {/* building number */ renderAddressField(address.building, '🏢', height)}
//
//         <View style={{ flexDirection: 'row' }}>
//           { renderAddressField(address.apt, strings('AddressDetail.apt'), height) }
//           { renderAddressField(address.floor, strings('AddressDetail.floor'), height) }
//         </View>
//
//         <Text style={{ ...styles.notesText }}>
//           {address.notes}
//         </Text>
//       </View>
//
//       {mapView}
//     </View>
//   );
// };
//
// const styles = {
//   addressTextLayout: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginLeft: 15,
//     marginRight: 15
//   },
//   streetText: {
//     fontSize: 21,
//     height: 30,
//     alignSelf: 'stretch',
//     textAlign: 'center',
//     fontFamily: 'BahijJanna-Bold',
//     color: 'black'
//   },
//   notesText: {
//     fontSize: 18,
//     fontFamily: 'BahijJanna',
//     backgroundColor: 'transparent',
//     color: 'black'
//   },
//   addressText: {
//     fontSize: 18,
//     fontFamily: 'BahijJanna',
//     backgroundColor: 'transparent',
//     color: 'black'
//   }
// };
//
// export { AddressDetail };
