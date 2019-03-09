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


  render() {
    const {
      visible
    } = this.props;


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




export default connect(mapStateToProps, {
  setCurrentLocation
})(CurrentLocationModal);
