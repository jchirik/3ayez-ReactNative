import React, { Component } from 'react';
import { Text, TouchableOpacity, View, Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import FastImage from 'react-native-fast-image';

import { AyezText } from '../_common';
import { ItemIncrementer } from '.';
import { strings, translate } from '../../i18n.js';
import colors from '../../theme/colors';


class ItemRow extends Component {
  constructor(props) {
    super(props);
  }

  // text block displaying price (with original price + savings, if avail)
  renderPrice(price, promotion_price, item) {
    let mainPriceText = '-';
    let previousPriceText = '';
    let savingsText = '';

    if (price) {
      mainPriceText = `${price.toFixed(2)} LE`;

      if (promotion_price) {
        mainPriceText = `${promotion_price.toFixed(2)} LE`;
        previousPriceText = `${price.toFixed(2)}`;
        const savingsAmount = price - promotion_price;
        if (savingsAmount !== 0) {
          savingsText = `وفر ${savingsAmount.toFixed(2)} جنيه`;
        }
      }
    }

    if (item.incr && item.unit) {
      mainPriceText += ` / ${item.incr}${item.unit}`;
    } else if (item.incr && item.incr !== 1) {
      mainPriceText += ` / ${item.incr}`;
    }

    return (
      <View style={{ flexDirection: 'row' }}>
        {previousPriceText ? (
          <AyezText
            style={{
              textDecorationLine: 'line-through',
              textDecorationStyle: 'solid',
              marginRight: 4
            }}
          >
            {previousPriceText}
          </AyezText>
        ) : null }

        <AyezText>
          {mainPriceText}
        </AyezText>
      </View>
    );
  }

  renderQuantity(item, mutableQuantity) {
    if (!mutableQuantity) {
      const displayedQuantity = `${item.quantity}`;

      if (item.unit) {
        displayedQuantity += item.unit;
      }

      return (
        <AyezText
          regular
          style={{
            marginHorizontal: 10,
            opacity: item.invalid ? 0.4 : 1,
          }}
        >
          {item.invalid ? 0 : displayedQuantity}
        </AyezText>
      );
    }

    let weightNotification = null;
    if (item.unit) {
      weightNotification = (
        <AyezText
          regular
          style={{
            color: '#f27407',
            fontSize: 16,
            lineHeight: 18,
            marginTop: 10,
            marginLeft: 3
          }}
        >
          {strings('WorkingBasket.weightsVary')}
        </AyezText>
      );
    }

    return (
      <View>
        <ItemIncrementer
          item={item}
          color={this.props.isSearchResult ? '#0094ff' : null}
          quantity={item.quantity}
          seller={this.props.seller}
          style={{ width: 92, height: 36 }}
        />
        {/* {weightNotification} */}
      </View>
    );
  }

  render() {
    const {
      item, // passed in as an arg
      mutableQuantity, // passed in as an arg
      noQuantity,
      seller,
      orderPoints,
      isSearchResult
    } = this.props;

    let price = parseFloat(item.price);
    let promotionPrice = parseFloat(item.promotion_price);
    // if (isSearchResult || noQuantity) {
    //   price = parseFloat(item.price);
    //   promotionPrice = parseFloat(item.promotion_price);
    // }

    const points = parseInt(item.points, 10) * item.quantity;

    const isReward = item.type === 'reward';

    return (
      <View
        style={{
          borderColor: '#97979722',
          borderBottomWidth: 1,
          flex: 1,
          padding: 8,
          paddingTop: 12,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <View>
          <FastImage
            style={{
              width: 58,
              height: 58,
              backgroundColor: '#fff',
              opacity: item.invalid ? 0.3 : 1
            }}
            resizeMode={'contain'}
            source={{ uri: item.thumbnail_url }}
          />
        </View>

        <View
          style={{
            backgroundColor: 'transparent',
            flex: 1,
            paddingLeft: 10,
            paddingRight: 10
          }}
        >
          <View style={{ opacity: item.invalid ? 0.3 : 1 }}>
            {this.renderPrice(price, promotionPrice, item)}
          </View>
          <Text
            style={[
              styles.itemTextStyle,
              {
                color: item.invalid ? 'red' : 'black',
                textDecorationStyle: 'solid',
                textDecorationLine: item.invalid ? 'line-through' : 'none'
              }
            ]}
          >
            {translate(item)}
          </Text>
          <Text style={styles.itemIncrTextStyle}>
            {item.incr + ' ' + item.unit}
          </Text>
        </View>
        {noQuantity ? null : this.renderQuantity(item, mutableQuantity)}
      </View>
    );
  }
}

const styles = {
  itemTextStyle: {
    fontFamily: 'Poppins',
    fontSize: 12,
    marginBottom: 6,
    backgroundColor: 'transparent'
  },
  itemIncrTextStyle: {
    fontFamily: 'Poppins',
    fontSize: 12,
    color: colors.steel
  }
};

export default connect(
  null,
  null
)(ItemRow);
