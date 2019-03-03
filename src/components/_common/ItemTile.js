import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { translate, strings, formatCurrency } from '../../i18n.js';
import { addToBasket } from '../../actions';
import colors from '../../theme/colors';
import { AyezText, ItemIncrementer, PlaceholderFastImage } from '.';
import { Draggable } from './DragComponent';

import images from '../../theme/images'
import { sceneKeys, navigateTo } from '../../router';

const Image_HEIGHT_RATIO = '48%';
const TEXT_HEIGHT_RATIO = '37%';
const BUTTON_HEIGHT_RATIO = '10%';

const PRICE_HEIGHT_RATIO = '30%';
const NAME_HEIGHT_RATIO = '50%';
const UNIT_HEIGHT_RATIO = '20%';


class ItemTile extends PureComponent {
  constructor(props) {
    super(props);
  }

  _renderPromotionBadge(price, promotionPrice) {
    if (price === null || promotionPrice === null) {
      return null;
    }

    const savingsPercent = Math.round(((price - promotionPrice) * 100) / price);
    if (savingsPercent === 0) {
      return null;
    }

    return (
      <View style={styles.savingsPercentContainer} pointerEvents={'none'}>
        <AyezText regular size={12} color={'white'}
          style={styles.savingsPercent}>-{savingsPercent}%</AyezText>
      </View>
    );
  }

  _renderMaxBadge(max_per_basket) {
    if (!max_per_basket) {
      return null;
    }

    return (
      <View style={styles.maxPerBasketContainer} pointerEvents={'none'}>
        <AyezText regular size={15} color={'white'}
          style={styles.maxPerBasketText}>
          {strings('Items.limit', { max_limit: max_per_basket })}
        </AyezText>
      </View>
    );
  }

  renderScale(unit) {
    if (unit && (unit == 'g' || unit == 'kg')) {
      return <Image style={styles.scaleStyle} source={images.scaleIcon} />;
    }

    return null;
  }

  // text block displaying price (with original price + savings, if avail)
  _renderItemText(price, promotion_price, item) {
    let mainPriceText = '-';
    let previousPriceText = '';
    let savingsText = '';
    if (price !== null) {
      mainPriceText = formatCurrency(price);
      if (promotion_price !== null) {
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
      <View style={styles.textContainer}>
        <View style={styles.priceContainer}>
          <AyezText
            medium
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            numberOfLines={1}
            style={styles.mainPrice}
          >
            {mainPriceText + ' '}
          </AyezText>
          {previousPriceText !== '' && (
            <AyezText
              medium
              adjustsFontSizeToFit
              minimumFontScale={0.5}
              numberOfLines={1}
              style={styles.previousPrice}
            >
              {previousPriceText}
            </AyezText>
          )}
        </View>
        <View style={styles.titleTextContianer}>
          <AyezText extralight numberOfLines={2} style={styles.titleText}>
            {translate(item)}
          </AyezText>
        </View>

        <AyezText regular style={styles.unitText}>{item.incr + item.unit}</AyezText>
      </View>
    );
  }

  _renderItemIncrementer(item, quantity) {
    let incrementer = (
      <ItemIncrementer
        style={{ height: '100%' }}
        item={item}
        quantity={quantity}
        seller={this.props.seller}
      />
    )

    if (this.props.customIncrementer) {
      incrementer = this.props.customIncrementer;
    }

    return (
      <View style={{ height: BUTTON_HEIGHT_RATIO }}>
        {incrementer}
      </View>
    );
  }
  _renderImage(url, unit, draggable) {
    const disabled = (this.props.customerIncrementer);

    const mainComponent = (
      <TouchableOpacity
        onPress={() => {
          navigateTo(sceneKeys.itemPage, { item: this.props.item })
        }}
        style={{ alignSelf: 'stretch' }}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
      >
        <PlaceholderFastImage
          style={{ width: '100%', height: '98%' }}
          source={{ uri: url }}
        />
        {this.renderScale(unit)}
      </TouchableOpacity>
    );

    if (draggable) {
      return (
        <Draggable data={this.props.item} style={[styles.itemImageContainer]}>
          {mainComponent}
        </Draggable>
      );
    }

    return (
      <View style={[styles.itemImageContainer]}>
        {mainComponent}
      </View>
    )

  }
  render() {
    const { item, customIncrementer, items_array, width, height, draggable, style } = this.props;
    const {
      thumbnail_url,
      image_url,
      price,
      promotion_price,
      max_per_basket,
      unit
    } = item;
    const url = thumbnail_url || image_url;
    // derive quantity from working basket hash
    let foundItem = null;
    if (!customIncrementer) {
      foundItem = items_array.find(w_item => w_item.upc === item.upc);
    }
    const quantity = foundItem ? foundItem.quantity : 0;

    return (
      <View style={[styles.itemCellContainer, { width, height }, style]}>
        {this._renderImage(url, unit, draggable)}
        {this._renderItemText(price, promotion_price, item)}
        {this._renderItemIncrementer(item, quantity)}
        {this._renderPromotionBadge(item.price, item.promotion_price)}
        {this._renderMaxBadge(max_per_basket)}
      </View>
    );
  }
}

const styles = {
  scaleStyle: {
    zIndex: 10,
    position: 'absolute',
    right: 5,
    bottom: 5,
    width: '20%',
    height: '20%'
  },
  textContainer: {
    width: '100%',
    flexWrap: 'nowrap',
    height: TEXT_HEIGHT_RATIO
  },
  titleTextContianer: {
    height: NAME_HEIGHT_RATIO,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  unitText: {
    opacity: 1,
    alignSelf: 'stretch',
    height: UNIT_HEIGHT_RATIO,
    textAlign: 'left',
    fontSize: 12,
    color: colors.steel
  },
  itemCellContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    zIndex: 100,
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  titleText: {
    flex: 1,
    alignSelf: 'stretch',
    opacity: 1,
    textAlign: 'left',
    fontSize: 12,
    color: 'black'
  },
  mainPrice: {
    alignSelf: 'stretch',
    flexWrap: 'nowrap',
    letterSpacing: 0,
    textAlign: 'left',
    fontSize: 14,
    color: 'black'
  },
  previousPrice: {
    letterSpacing: 0,
    fontSize: 14,
    alignSelf: 'stretch',
    color: 'red',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textAlign: 'left'
  },
  savings: {
    color: colors.coralPink,
    textAlign: 'left',
    fontSize: 10,
    lineHeight: 17,
    backgroundColor: 'transparent'
  },
  priceContainer: {
    height: PRICE_HEIGHT_RATIO,
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center'
  },
  savingsPercentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.coralPink,
    justifyContent: 'center'
  },
  maxPerBasketContainer: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    height: 24,
    borderRadius: 9,
    backgroundColor: colors.tealish,
    justifyContent: 'center'
  },
  savingsPercent: {
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  maxPerBasketText: {
    textAlign: 'center',
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: 'transparent'
  },
  itemImageContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: Image_HEIGHT_RATIO,
    width: '100%'
  }
};

const mapStateToProps = ({ Baskets, Seller }) => {
  const seller = Seller;
  let items_array = [];
  if (Seller.id) {
    items_array = Baskets.baskets[Seller.id].items_array
  }


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
)(ItemTile);
