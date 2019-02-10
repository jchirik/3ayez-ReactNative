import React from 'react';
import {
  View,
  PanResponder,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  I18nManager
} from 'react-native';
import { connect } from 'react-redux';
import { addToBasket } from '../../../actions';

import PropTypes from 'prop-types';

const allOrientations = [
  'portrait',
  'portrait-upside-down',
  'landscape',
  'landscape-left',
  'landscape-right'
];

const Context = React.createContext();

class DragModal extends React.Component {
  render() {
    const {
      content: {
        startPosition: { width, height }
      }
    } = this.props;
    return (
      <Modal
        onRequestClose={() => false}
        transparent={true}
        supportedOrientations={allOrientations}
      >
        <View
          style={{
            flex: 1,
            flexDirection: I18nManager.isRTL ? 'row-reverse' : undefined
          }}
        >
          <TouchableWithoutFeedback onPressIn={this.props.drop}>
            <Animated.View
              style={[
                this.props.location.getLayout(),
                {
                  width: width,
                  height: height
                }
              ]}
            >
              {this.props.content.children}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    );
  }
}

class DragContainer extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'DragContainer';
    this.containerLayout;

    let location = new Animated.ValueXY();

    this.state = {
      location
    };

    this.draggables = [];
    this.onDrag = this.onDrag.bind(this);
    this._handleDrop = this._handleDrop.bind(this);
  }

  static propTypes = {
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func
  };

  componentWillUnmount() {
    if (this._listener) this.state.location.removeListener(this._listener);
  }

  getDragContext() {
    return {
      onDrag: this.onDrag,
      container: this.containerLayout,
      dragging: this.state.draggingComponent
    };
  }

  getChildContext() {
    return { dragContext: this.getDragContext() };
  }

  static childContextTypes = {
    dragContext: PropTypes.any
  };

  _addLocationOffset(point) {
    if (!this.state.draggingComponent) return point;
    return {
      x: point.x + this.state.draggingComponent.startPosition.width / 2,
      y: point.y + this.state.draggingComponent.startPosition.height / 2
    };
  }
  _endDragging(isAddedToBasket) {
    if (this.props.onDragEnd) {
      this.props.onDragEnd();
    }
    this._locked = true;
    if (this.state.draggingComponent) {
      if (!isAddedToBasket) {
        return Animated.timing(this.state.location, {
          duration: 200,
          toValue: {
            x: 0,
            y: 0
          }
        }).start(() => {
          this.state.draggingComponent.ref.setOpacityTo(1);
          this._locked = false;
          this.setState({
            draggingComponent: null
          });
        });
      }
      this.state.draggingComponent.ref.setOpacityTo(1);
      this.setState({
        draggingComponent: null
      });
    }
  }
  _handleDrop({ dy, dx }) {
    if (dy <= 100) {
      this._endDragging(false);
    } else {
      Animated.timing(this.state.location, {
        toValue: { x: dx, y: dy + 500 },
        duration: 300
      }).start(() => {
        this.props.addToBasket(
          this.state.draggingComponent.data,
          this.props.seller.id
        );
        this._endDragging(true);
      });
    }
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return this.state.draggingComponent ? true : false;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        !!this.state.draggingComponent,
      onPanResponderMove: (...args) =>
        Animated.event([
          null,
          {
            dx: this.state.location.x,
            dy: this.state.location.y
          }
        ]).apply(this, args),
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this._handleDrop(gestureState);
      }
    });
  }

  onDrag(ref, children, data) {
    ref.measure((...args) => {
      if (this._listener) this.state.location.removeListener(this._listener);
      let location = new Animated.ValueXY();
      this._listener = location.addListener(args =>
        this._addLocationOffset(args)
      );
      this._offset = {
        x: args[4],
        y: args[5]
      };
      location.setOffset(this._offset);
      this.setState(
        {
          location,
          draggingComponent: {
            ref,
            data,
            children: React.Children.map(children, child => {
              return React.cloneElement(child, { dragging: true });
            }),
            startPosition: {
              x: args[4],
              y: args[5],
              width: args[2],
              height: args[3]
            }
          }
        },
        () => {
          if (this.props.onDragStart) this.props.onDragStart();
        }
      );
    });
  }

  render() {
    return (
      <View
        style={[{ flex: 1 }, this.props.style]}
        onLayout={e => (this.containerLayout = e.nativeEvent.layout)}
        {...this._panResponder.panHandlers}
      >
        {this.props.children}
        {this.state.draggingComponent ? (
          <DragModal
            content={this.state.draggingComponent}
            location={this.state.location}
            drop={this._handleDrop}
          />
        ) : null}
      </View>
    );
  }
}
const mapStateToProps = ({ Baskets, Seller }) => {
  const seller = Seller;
  const { items_array } = Baskets.baskets[Seller.id];

  return {
    seller,
    items_array
  };
};

export default connect(
  mapStateToProps,
  {
    addToBasket
  }
)(DragContainer);
