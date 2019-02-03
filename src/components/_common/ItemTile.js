import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { translate, strings } from '../../i18n.js';
import { addToBasket } from '../../actions';
import colors from '../../theme/colors';
import fonts from '../../theme/fonts';
import { ItemIncrementer } from '.';
import { Draggable } from './DragComponent';
import FastImage from 'react-native-fast-image';

const loadingCircleGreen = require('../../../assets/images/loading_circle_green.png');
const scaleImage = require('../../../assets/images/scale.png');

const Image_HEIGHT_RATIO = '48%';
const TEXT_HEIGHT_RATIO = '37%';
const BUTTON_HEIGHT_RATIO = '15%';

const PRICE_HEIGHT_RATIO = '30%';
const NAME_HEIGHT_RATIO = '50%';
const UNIT_HEIGHT_RATIO = '20%';

const formatCurrency = (amount) => {
  return `${amount.toFixed(2)} EGP`;
}

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
        <Text style={styles.savingsPercent}>-{savingsPercent}%</Text>
      </View>
    );
  }

  _renderMaxBadge(max_per_basket) {
    if (!max_per_basket) {
      return null;
    }

    return (
      <View style={styles.maxPerBasketContainer} pointerEvents={'none'}>
        <Text style={styles.maxPerBasketText}>
          {strings('Item.limit')} {max_per_basket}
        </Text>
      </View>
    );
  }

  renderScale(unit) {
    if (unit && (unit == 'g' || unit == 'kg')) {
      return <Image style={styles.scaleStyle} source={scaleImage} />;
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
          savingsText = `Save ${formatCurrency(savingsAmount)}`;
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
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            numberOfLines={1}
            style={styles.mainPrice}
          >
            {mainPriceText + ' '}
          </Text>
          {previousPriceText !== '' && (
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.5}
              numberOfLines={1}
              style={styles.previousPrice}
            >
              {previousPriceText}
            </Text>
          )}
        </View>
        <View style={styles.titleTextContianer}>
          <Text numberOfLines={2} style={styles.titleText}>
            {translate(item)}
          </Text>
        </View>

        <Text style={styles.unitText}>{item.incr + item.unit}</Text>
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
        onPress={() => Actions.itemPage({ item: this.props.item })}
        style={{ alignSelf: 'stretch' }}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
      >
        <FastImage
          style={{ width: '100%', height: '98%' }}
          resizeMode={FastImage.resizeMode.contain}
          defaultSource={loadingCircleGreen}
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
    fontFamily: fonts.poppinsExtraLight,
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
    fontFamily: fonts.poppinsMedium,
    fontSize: 14,
    color: 'black'
  },
  previousPrice: {
    letterSpacing: 0,
    fontSize: 14,
    alignSelf: 'stretch',
    fontFamily: fonts.poppinsMedium,
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
    fontSize: 11,
    color: 'white',
    backgroundColor: 'transparent'
  },
  maxPerBasketText: {
    textAlign: 'center',
    fontSize: 15,
    marginLeft: 8,
    marginRight: 8,
    color: 'white',
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
