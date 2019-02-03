import React, { PureComponent } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { addToBasket, removeFromBasket } from '../../actions';

import { strings } from '../../i18n.js';
import Incrementer from './Incrementer';

class ItemIncrementer extends PureComponent {
  constructor(props) {
    super(props);
    this.incrementItem = this.incrementItem.bind(this);
    this.decrementItem = this.decrementItem.bind(this);
  }
  incrementItem() {
    if (this.props.incrementFunction) {
      this.props.incrementFunction();
    } else {
      this.props.addToBasket(this.props.item, this.props.seller.id);
    }
  }
  decrementItem() {
    if (this.props.decrementFunction) {
      this.props.decrementFunction();
    } else {
      this.props.removeFromBasket(this.props.item, this.props.seller.id);
    }
  }

  render() {
    const { fullscreen, item, quantity, style } = this.props;
    const { unit } = item;

    const color = this.props.color || '#15C860';

    if (quantity === 0) {
      return (
        <TouchableOpacity
          style={{ ...styles.mainContainer, ...style }}
          onPress={this.incrementItem}
        >
          <Text style={{ ...styles.addItemText, color }}>
            {strings('ShoppingComponent.3ayezButton')}
          </Text>
        </TouchableOpacity>
      );
    }

    const maxReached = quantity === item.max_per_basket;
    return (
      <Incrementer
        fullscreen={fullscreen}
        item={item}
        quantity={quantity}
        style={style}
        color={color}
        quantityText={quantity + unit}
        maxReached={maxReached}
        onIncrement={this.incrementItem}
        onDecrement={this.decrementItem}
      />
    );
  }
}

const styles = {
  mainContainer: {
    height: 26,
    margin: 2,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'stretch',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5
  },
  addItemText: {
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
    alignSelf: 'center'
  },
  incrementText: {
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
    alignSelf: 'center',
    color: 'black'
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default connect(
  null,
  {
    addToBasket,
    removeFromBasket
  }
)(ItemIncrementer);
