import React, { Component } from 'react';
import {
  View,
  TextInput,
  FlatList,
   Image,
   ActivityIndicator,
   TouchableOpacity,
   SectionList,
   Platform,
   BackHandler,
   KeyboardAvoidingView,
   AsyncStorage,
   ScrollView
 } from 'react-native';

import { Actions } from 'react-native-router-flux';
 import firebase from 'react-native-firebase';
 import { AppEventsLogger } from 'react-native-fbsdk';

import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import { connect } from 'react-redux';
import {
  Header,
  BlockButton,
  LoadingOverlay,
  AyezText,
  InputRow
} from '../_common';
import {
  setAddress
} from '../../actions';

import {
  strings,
  translate,
  FONT_MEDIUM
} from '../../i18n.js';

import { sceneKeys, navigateTo, navigateBack } from '../../router';

import images from '../../theme/images'
import colors from '../../theme/colors'


class AddressSelect extends Component {

  renderItem({ item, index }) {
    return (
      <TouchableOpacity
        onPress={() => this.props.setAddress(item)}
        style={{
          height: 120, backgroundColor: 'white', flexDirection: 'row',
          borderBottomWidth: 1, borderColor: '#f7f7f7',
          alignItems: 'center'
          }}
      >
        <View style={{ flex: 1, marginLeft: 26, alignItems: 'flex-start' }}>
          <AyezText medium>{item.street || item.title}</AyezText>
          <AyezText regular>{item.building ? strings('Address.detail', {building: item.building, apt: item.apt}) : ''}</AyezText>
          <AyezText regular>{item.name || ''}</AyezText>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header
          title={strings('AddressSelection.header')}
          blackStyle
        />
        <FlatList
          style={{ flex: 1 }}
          data={this.props.addresses}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item) => item.id}

          ListHeaderComponent={<View style={{ width: 8}} />}
          ListFooterComponent={
            <View style={{ padding: 10 }}>
              <TouchableOpacity
                onPress={() => navigateTo(sceneKeys.addressCreate)}
                style={{
                  height: 80, paddingHorizontal: 10,
                  borderColor: '#f7f7f7',
                  justifyContent: 'center',
                  alignSelf: 'stretch',
                  alignItems: 'flex-start'
                  }}
              >
                <AyezText medium color={colors.ayezGreen}>{strings('AddressSelection.addNewAddress')}</AyezText>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    );
  }
}

const mapStateToProps = ({ Addresses }) => {
  const {
    addresses
  } = Addresses;
  return {
    addresses
  };
};

export default connect(mapStateToProps, {
  setAddress
})(AddressSelect);
