import React, { Component } from 'react';
import { TouchableOpacity, View, Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { removeFromBasket } from '../../actions';

import { AyezText, ItemIncrementer, PlaceholderFastImage } from '.';
import { strings, translate, formatCurrency } from '../../i18n.js';
import colors from '../../theme/colors';

import images from '../../theme/images'


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
          <AyezText regular
            style={{
              textDecorationLine: 'line-through',
              textDecorationStyle: 'solid',
              marginRight: 4
            }}
          >
            {previousPriceText}
          </AyezText>
        ) : null }

        <AyezText regular>
          {mainPriceText}
        </AyezText>
      </View>
    );
  }

  renderQuantity(item, mutableQuantity) {
    if (!mutableQuantity) {
      let displayedQuantity = `${item.quantity}`;
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
      isSearchResult,
      invalid
    } = this.props;

    let price = parseFloat(item.price);
    let promotionPrice = parseFloat(item.promotion_price);





    if (item.is_custom) {
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
            alignItems: 'center',
            opacity: invalid ? 0.3 : 1
          }}
        >
          <Image
            style={{
              width: 40,
              height: 40,
              margin: 9
            }}
            resizeMode={'contain'}
            source={images.customProductPlaceholder}
          />

          <View
            style={{
              backgroundColor: 'transparent',
              flex: 1,
              paddingLeft: 10,
              paddingRight: 10,
              alignItems: 'flex-start'
            }}
          >
            <AyezText medium size={13}>
              {item.custom_name}
            </AyezText>
            <AyezText regular size={13}>
              {item.custom_description}
            </AyezText>
          </View>

          <AyezText regular style={{ marginHorizontal: 10 }}>
            {item.custom_amount}
          </AyezText>

          {(mutableQuantity) ? (
          <TouchableOpacity
            onPress={() => this.props.removeFromBasket(item, seller.id)}>
            <Image
              source={images.removeIcon}
              style={{ width: 14, height: 14, margin: 14, tintColor: 'black'}}
              resizeMode={'contain'}
              />
          </TouchableOpacity>
        ) : null}
        </View>
      );
    }








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
          alignItems: 'center',
          opacity: invalid ? 0.3 : 1
        }}
      >
        <PlaceholderFastImage
          style={{
            width: 58,
            height: 58,
            backgroundColor: '#fff',
          }}
          source={{ uri: item.thumbnail_url }}
        />

        <View
          style={{
            backgroundColor: 'transparent',
            flex: 1,
            paddingLeft: 10,
            paddingRight: 10,
            alignItems: 'flex-start'
          }}
        >
          <View>
            {this.renderPrice(price, promotionPrice, item)}
          </View>
          <AyezText
            regular
            size={12}
            color={'black'}
            style={{
                textAlign: 'left',
                marginBottom: 6,
                backgroundColor: 'transparent'
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
  { removeFromBasket }
)(ItemRow);
