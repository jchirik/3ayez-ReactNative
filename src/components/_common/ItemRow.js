import React, { Component } from 'react';
import { TouchableOpacity, View, Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { AyezText, ItemIncrementer, PlaceholderFastImage } from '.';
import { strings, translate, formatCurrency } from '../../i18n.js';
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
      mainPriceText = formatCurrency(price);

      if (promotion_price) {
        mainPriceText = formatCurrency(promotion_price);
        previousPriceText = formatCurrency(price);
        const savingsAmount = price - promotion_price;
        if (savingsAmount !== 0) {
          savingsText = strings('Items.savingsText', {savings: formatCurrency(savingsAmount)});
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
          {strings('Items.weightsVary')}
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
          <PlaceholderFastImage
            style={{
              width: 58,
              height: 58,
              backgroundColor: '#fff',
              opacity: item.invalid ? 0.3 : 1
            }}
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
          <AyezText
            regular
            size={12}
            color={item.invalid ? 'red' : 'black'}
            style={{
                marginBottom: 6,
                backgroundColor: 'transparent',
                textDecorationStyle: 'solid',
                textDecorationLine: item.invalid ? 'line-through' : 'none'
            }}
          >
            {translate(item)}
          </AyezText>
          {(item.incr !== 1 || item.unit) ? (
            <AyezText regular size={12} color={colors.steel}>
              {item.incr + ' ' + item.unit}
            </AyezText>
          ) : null}
        </View>
        {noQuantity ? null : this.renderQuantity(item, mutableQuantity)}
      </View>
    );
  }
}


export default connect(
  null,
  null
)(ItemRow);
