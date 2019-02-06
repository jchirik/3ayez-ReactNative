import React, { PureComponent } from 'react';
import { View, TouchableOpacity, PanResponder, Animated } from 'react-native';
import PropTypes from 'prop-types';
class Draggable extends PureComponent {
  constructor(props) {
    super(props);
    this.displayName = 'Draggable';
    this._initiateDrag = this._initiateDrag.bind(this);
    this.state = {
      hide: 1
    };
  }

  static contextTypes = {
    dragContext: PropTypes.any
  };

  _initiateDrag() {
    this.refs.wrapper.setOpacityTo(0, 0);
    if (!this.props.disabled)
      this.context.dragContext.onDrag(
        this.refs.wrapper,
        this.props.children,
        this.props.data,
        this.state
      );
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: (e, { dx, dy }) => {
        if (dy > Math.abs(dx) && dy > 0) {
          return true;
        }
        return false;
      },
      onMoveShouldSetPanResponderCapture: (e, { dx, dy }) => {
        if (dy > Math.abs(dx) && dy > 0) {
          return true;
        }
        return false;
      },
      onPanResponderGrant: this._initiateDrag,
      onPanResponderMove: () => {},
      onPanResponderRelease: () => {}
    });
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[this.props.style]}
        ref="wrapper"
      >
        <View
          style={[{ flex: 1, alignSelf: 'stretch' }]}
          {...this._panResponder.panHandlers}
        >
          {this.props.children}
        </View>
      </TouchableOpacity>
    );
  }
}

export default Draggable;
