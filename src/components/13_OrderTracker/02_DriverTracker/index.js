import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Platform,
  BackHandler
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import {
  listenToDriver,
  endListeningToDriver
} from '../../../actions';

import {
  strings,
  translate
} from '../../../i18n.js';

import {
  AyezText,
  BackButton
} from '../../_common';
const location_dot = require('../../../../assets/images_v2/OrderTracker/location_dot.png');

class DriverTracker extends Component {

  componentDidMount() {
    this.props.listenToDriver(this.props.driver_id);
  }

  componentWillUnmount() {
    this.props.endListeningToDriver();
  }

  render() {
    const { location, phone, driver_loading } = this.props;
    const rotation = 0;

    if (driver_loading) {
      return <ActivityIndicator size="small" style={{ flex: 1 }} />
    }
    if (!location) {
      return (
        <View style={{ flex: 1 }}>
          <AyezText medium>{strings('DriverTracker.noLocation')}</AyezText>
          <BackButton fixed />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <MapView
          ref={map => { this.map = map }}
          style={{ flex: 1 }}
          showsUserLocation
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.lat,
              longitude: location.lng
            }}
            rotation={null}
          >
            <Image
              source={location_dot}
              style={{ width: 40, height: 40 }}
              resizeMode={'contain'}
            />
          </Marker>
        </MapView>
        <BackButton fixed />
      </View>
    );
  }
}

const mapStateToProps = ({ DriverTracker }) => {
  const {
    location,
    phone,
    driver_loading
  } = DriverTracker;
  return {
    location,
    phone,
    driver_loading
   };
 };

export default connect(mapStateToProps,
  {
    listenToDriver,
    endListeningToDriver
  }
)(DriverTracker);
