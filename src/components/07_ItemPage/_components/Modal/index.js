import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Modal } from 'react-native';
// import Modal from 'react-native-modal';
import { Divider } from '..';

import {
  AyezText
} from '../../../_common';

import styles from './styles';

export default class _ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true
    };
  }

  _toggle = () => {
    this.props.callback();
    this.setState({
      isVisible: this.state.isVisible ^ true
    });
  };

  render() {
    return (
      <Modal
        isVisible={this.state.isVisible}
        onSwipe={this._toggle}
        swipeDirection="left"
      >
        <View style={styles.container}>
          <View style={styles.modal}>
            <Image source={this.props.image} style={styles.image} />
            <AyezText regular style={styles.title}>{this.props.text}</AyezText>
            <TouchableOpacity
              style={styles.confirmationContainer}
              onPress={this._toggle}
            >
              <Divider style={styles.divider} />
              <AyezText regular style={styles.confirmationText}>
                {this.props.confirmation}
              </AyezText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
