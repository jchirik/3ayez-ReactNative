import React from 'react';
import {
  Text,
  View,
  Platform
} from 'react-native';

import { strings } from '../../Helpers.js';

const renderAddressField = (text, label) => {
  if (!text) {
    return null;
  }
  return (
    <View style={styles.addressTextLayout}>
    <Text style={styles.addressText}>{text}</Text>
    <Text style={styles.addressLabel}>{label}:</Text>
    </View>
  );
};

const AddressDetail = ({ address }) => {
  return (
    <View>
    <View style={styles.addressTextLayout}>
    <Text style={styles.addressText}>{address.name}</Text>
    <Text style={{
      fontSize: 14,
      lineHeight: 14,
      marginLeft: 5,
    }}>🏠</Text>
    </View>

    {/* street */ renderAddressField(address.street, strings('AddressDetail.street'))}
    {/* building number */ renderAddressField(address.building, strings('AddressDetail.building'))}
    {/* building name */ renderAddressField(address.building_name, strings('AddressDetail.building_name'))}
    {/* floor */ renderAddressField(address.floor, strings('AddressDetail.floor'))}
    {/* apartment # */ renderAddressField(address.apt, strings('AddressDetail.apt'))}
    {/* notes */ renderAddressField(address.notes, strings('AddressDetail.notes'))}
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
    backgroundColor: 'transparent',
    lineHeight: 22,
    height: 20,
    color: 'black'
  },
  addressLabel: {
    fontFamily: 'BahijJanna',
    fontSize: 16,
    lineHeight: 22,
    height: 20,
    marginLeft: 5,
    color: 'black'
  }
};

export { AddressDetail };
