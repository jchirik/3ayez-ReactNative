import React, { Component } from 'react';
import { View, Slider, I18nManager } from 'react-native';
import styles, { tintColor, trackColor, getItemStyle } from './styles';
import { strings } from '../../../../i18n.js';
import {
  AyezText
} from '../../../_common';
import { isAndroid } from '../../../../Helpers';

const MINIMUM_VALUE = -1;
const MAXIMUM_VALUE = 1;
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
          thumbTintColor={tintColor}
          minimumTrackTintColor={trackColor}
          maximumTrackTintColor={trackColor}
          thumbStyle={styles.thumpStyle}
          style={isAndroid && I18nManager.isRTL ? {transform: [{ rotate: '180deg'}]}  : {}}
        />
        <View style={styles.itemsStyle}>
          <AyezText
            regular
            onPress={() => this._setValue(-1)}
            style={getItemStyle(this.props.value, -1)}
          >
            {strings('ItemView.ripenessGreen')}
          </AyezText>
          <AyezText
            regular
            onPress={() => this._setValue(0)}
            style={getItemStyle(this.props.value, 0)}
          >
            {strings('ItemView.ripenessNormal')}
          </AyezText>
          <AyezText
            regular
            onPress={() => this._setValue(1)}
            style={getItemStyle(this.props.value, 1)}
          >
            {strings('ItemView.ripenessRipe')}
          </AyezText>
        </View>
      </View>
    );
  }
}
