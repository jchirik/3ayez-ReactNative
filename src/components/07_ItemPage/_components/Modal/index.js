import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
// import Modal from 'react-native-modal';
import { Divider } from '..';

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
            <Text style={styles.title}>{this.props.text}</Text>
            <TouchableOpacity
              style={styles.confirmationContainer}
              onPress={this._toggle}
            >
              <Divider style={styles.divider} />
              <Text style={styles.confirmationText}>
                {this.props.confirmation}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
