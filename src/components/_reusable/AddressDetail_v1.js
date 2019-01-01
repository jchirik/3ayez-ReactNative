import React from 'react';
import {
  Text,
  View,
  Platform
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const mapDetailStyle = [
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
];

const renderAddressField = (text, label) => {
  if (!text) {
    return null;
  }
  return (
    <View style={styles.addressTextLayout}>
      <Text style={styles.addressText} numberOfLines={1}>{text}</Text>
      <Text style={styles.addressLabel}>{label}:</Text>
    </View>
  );
};

const AddressDetail = ({ address }) => {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent:'center',
      alignItems: 'center',
    }}>

    <View>
      <View style={styles.addressTextLayout}>
        <Text style={styles.addressText}>Address</Text>
        <Text style={{
          fontSize: 14,
          marginLeft: 5,
        }}>🏠</Text>
      </View>
      {/* street */ renderAddressField(address.street, 'الشارع')}
      {/* building number */ renderAddressField(address.building, 'رقم المبنى')}
      {/* building name */ renderAddressField(address.building_name, 'اسم المبنى')}
      {/* floor */ renderAddressField(address.floor, 'الدور رقم')}
      {/* apartment # */ renderAddressField(address.apt, 'الشقة رقم')}
      {/* notes */ renderAddressField(address.notes, 'علامة مميزة')}
    </View>

    <MapView
      ref={map => { this.map = map }}
      style={{ height: 100, minWidth: 100, flex: 1, borderRadius: 5, marginLeft: 24 }}
      showsUserLocation
      customMapStyle={mapDetailStyle}
      provider={PROVIDER_GOOGLE}
      initialRegion={{
          latitude: address.latitude,
          longitude: address.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
      }}
    >
      <Marker
      coordinate={address}
    />
    </MapView>

  </View>
  );
};

const styles = {
  addressTextLayout: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  addressText: {
    fontFamily: 'BahijJanna-Bold',
    fontSize: 16,
    maxWidth: 120,
    backgroundColor: 'transparent',
    lineHeight: (Platform.OS === 'ios') ? 22 : 15,
    height: 20,
    color: 'black'
  },
  addressLabel: {
    fontFamily: 'BahijJanna',
    fontSize: 16,
    lineHeight: (Platform.OS === 'ios') ? 22 : 15,
    height: 20,
    marginLeft: 5,
    color: 'black'
  }
};

export { AddressDetail };
