import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  switchTouchableOpacity,
  getSwitchStyle,
  getTintStyle,
  getConfirmationStyle,
  getDeclineStyle
} from './styles';
import { strings } from '../../../../i18n.js';

export default class Switch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn: false
    };
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={switchTouchableOpacity}
        onPress={_ => this.setState({ isOn: this.state.isOn ? false : true })}
        style={getSwitchStyle(this.state.isOn)}
      >
        <View style={getTintStyle(this.state.isOn)} />
      </TouchableOpacity>
    );
  }
}
