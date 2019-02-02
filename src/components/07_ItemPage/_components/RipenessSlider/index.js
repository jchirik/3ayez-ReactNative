import React, { Component } from 'react';
import { View, Text, Slider } from 'react-native';
import styles, { tintColor, trackColor, getItemStyle } from './styles';
import { strings } from '../../../../i18n.js';
import {
  AyezText
} from '../../../_common';

const MINIMUM_VALUE = -1;
const MAXIMUM_VALUE = 1;
const STEP = 0.01;
const DEFAULT_VALUE = 0;

export default class RipenessSlider extends Component {

  _setValue = value => {
    this.props.onValueChange(value);
  };

  render() {
    return (
      <View>
        <Slider
          trackStyle={styles.trackStyle}
          value={this.props.value}
          onValueChange={(value) => this.props.onValueChange(value)}
          minimumValue={MINIMUM_VALUE}
          maximumValue={MAXIMUM_VALUE}
          step={STEP}
          thumbTintColor={tintColor}
          minimumTrackTintColor={trackColor}
          maximumTrackTintColor={trackColor}
          thumbStyle={styles.thumpStyle}
        />
        <View style={styles.itemsStyle}>
          <AyezText
            regular
            onPress={() => this._setValue(-1)}
            style={getItemStyle(this.props.value, -1)}
          >
            {strings('ItemView.green')}
          </AyezText>
          <AyezText
            regular
            onPress={() => this._setValue(0)}
            style={getItemStyle(this.props.value, 0)}
          >
            {strings('ItemView.normal')}
          </AyezText>
          <AyezText
            regular
            onPress={() => this._setValue(1)}
            style={getItemStyle(this.props.value, 1)}
          >
            {strings('ItemView.ripe')}
          </AyezText>
        </View>
      </View>
    );
  }
}
