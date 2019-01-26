import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import {
  addToBasket,
  removeFromBasket
} from '../../actions';

import { isAndroid } from '../../Helpers.js';
import { strings } from '../../i18n.js';

const plusIcon = require('../../../assets/images/incr_plus.png');
const minusIcon = require('../../../assets/images/incr_minus.png');

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

    const buttonDimension = fullscreen ? 12 : 9;

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

    const max_reached = (quantity === item.max_per_basket);

    return (
    <View style={{ ...styles.mainContainer, padding: (fullscreen ? 7 : 0), ...style }}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={this.decrementItem}
      >
        <Image
          source={minusIcon}
          style={{ tintColor: color, width: buttonDimension, height: buttonDimension }}
        />
      </TouchableOpacity>

      <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          minimumFontScale={0.5} style={styles.incrementText}>{quantity}{unit}</Text>

      <TouchableOpacity
        style={styles.iconContainer}
        onPress={this.incrementItem}
        disabled={max_reached}
      >
        <Image
          source={plusIcon}
          style={{
            tintColor: (max_reached ? '#CECECE' : color),
            width: buttonDimension,
            height: buttonDimension
          }}
        />
      </TouchableOpacity>
    </View>
    );
  }
}

const styles = {
  mainContainer: {
    height: 40,
    margin: 2,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'stretch',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  addItemText: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
    alignSelf: 'center'
  },
  incrementText: {
    fontSize: 17,
    flex: 1,
    textAlign: 'center',
    alignSelf: (isAndroid ? 'center' : 'stretch'),
    color: 'black'
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default connect(null, {
  addToBasket,
  removeFromBasket
})(ItemIncrementer);
