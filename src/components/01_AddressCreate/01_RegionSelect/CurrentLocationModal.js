import React, { Component } from 'react';
import { Text, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import {
  BlockButton
} from '../../_common';

import {
  setCurrentLocation
} from '../../../actions';

import {
  strings,
  translate
} from '../../../i18n.js';

import {
  STATUS_BAR_HEIGHT
} from '../../../Helpers.js';

class CurrentLocationModal extends Component {

  componentDidUpdate(prevProps) {

    // MOVE THIS (later)
    // if addresses stop loading && addresses has 0 length
      // open create address
    // otherwise, open address selection

    if (this.props.location && !prevProps.location) {
      this.props.onClose();
      Actions.refineLocation();
    }

    if (this.props.error && !prevProps.error) {
      setTimeout(() => {
        this.props.onClose();
        Actions.addressSearch();
      }, 1000)
    }
  }

  renderCurrentLocationRequest() {
    return (
      <View style={styles.whitePanel}>
        <Text style={{ textAlign: 'center' }}>Use your current location?</Text>
        <BlockButton
          text={'NO'}
          color={'red'}
          style={{
            marginTop: 20,
            marginLeft: 18,
            marginRight: 18,
          }}
          onPress={() => {
            this.props.onClose();
            Actions.addressSearch();
          }}
          />
        <BlockButton
          text={'YES'}
          style={{
            marginTop: 10,
            marginBottom: 24,
            marginLeft: 18,
            marginRight: 18,
          }}
          onPress={() => {
            this.props.setCurrentLocation()
          }}
          />
      </View>
    )
  }

  renderLoading() {
    return (
      <View style={styles.whitePanel}>
        <ActivityIndicator size="small" style={{ flex: 1 }} />
      </View>
    )
  }

  renderError() {
    return (
      <View style={styles.whitePanel}>
        <Text>Issue determining location.</Text>
      </View>
    )
  }

  render() {
    const {
      visible
    } = this.props;

    let modalComponent = this.renderCurrentLocationRequest();
    if (this.props.is_loading) {
      modalComponent = this.renderLoading();
    } else if (this.props.error) {
      modalComponent = this.renderError();
    }

    return (
      <Modal
        animationType="fade"
        visible={visible}
        transparent
      >
        <View style={styles.modalBackground} />
        { modalComponent }
      </Modal>
    );
  }
};

const styles = {
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute'
  },
  whitePanel: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: STATUS_BAR_HEIGHT + 48,
    width: 320,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 12,
  }
};


const mapStateToProps = ({ AddressCreate, CurrentLocation }) => {
  const { location } = AddressCreate;
  const { is_loading, error } = CurrentLocation;
  return {
    location,
    is_loading,
    error
  };
};

export default connect(mapStateToProps, {
  setCurrentLocation
})(CurrentLocationModal);
