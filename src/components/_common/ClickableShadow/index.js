import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Platform } from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import { isAndroid, androidVersion } from '../../../Helpers';
import colors from '../../../theme/colors';

export default class ClickableShadow extends Component {
  
  _createShadowOpt() {
    return {
      width: this.props.width,
      height: this.props.height,
      color: this.props.color,
      border: this.props.border,
      radius: this.props.radius,
      opacity: this.props.opacity,
      x: this.props.x,
      y: this.props.y,
      style: { ...this.props.style }
    };
  }

  render() {
    if (isAndroid && androidVersion < 21) {
      return (
        <BoxShadow setting={this._createShadowOpt()}>
          <TouchableOpacity
            style={{ width: this.props.width, height: this.props.height }}
            onPress={this.props.onPress}
          >
            {this.props.children}
          </TouchableOpacity>
        </BoxShadow>
      );
    }
    return (
      <TouchableOpacity
        style={{
          width: this.props.width,
          height: this.props.height,
          ...this.props.style
        }}
        onPress={this.props.onPress}
      >
        <View
          style={{
            width: '100%',
            height: '100%',
            borderRadius: this.props.radius,
            ...Platform.select({
              ios: {
                shadowColor: this.props.color,
                shadowOpacity: this.props.opacity,
                shadowRadius: this.props.radius
              },
              android: {
                elevation: this.props.elevation
              }
            })
          }}
        >
          {this.props.children}
        </View>
      </TouchableOpacity>
    );
  }
}

ClickableShadow.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  color: PropTypes.string,
  border: PropTypes.number,
  radius: PropTypes.number,
  opacity: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  elevation: PropTypes.number,
  onPress: PropTypes.function,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};

ClickableShadow.defaultProps = {
  style: undefined,
  children: undefined,
  color: colors.warmGrey,
  border: 2,
  radius: 10,
  opacity: 0.25,
  elevation: 2,
  x: 0,
  y: 2,
  onPress: undefined
};
