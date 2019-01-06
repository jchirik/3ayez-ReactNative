import _ from 'lodash';
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  View,
  Modal,
  FlatList,
  ScrollView,
  Text,
  Platform,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
  Image
} from 'react-native';

import {
  BackButton,
  ItemIncrementer
} from '../_reusable';

const loadingCircleGreen = require('../../../assets/images/loading_circle_green.png');

// import {
// } from '../../actions';
import { statusBarMargin, strings, localizeItem } from '../../Helpers.js';

// const ImgCacheLib = require('react-native-img-cache');
// const CachedImage = ImgCacheLib.CachedImage;

// const ITEM_HEIGHT = (Dimensions.get('window').width/3) + 42;

const window = Dimensions.get('window');

class ItemPage extends Component {

  constructor(props) {
    super(props);

    // this.state = {
    // };
  }


  // red circle that floats atop a discounted item
  renderPromotionBadge(price, promotionPrice) {
    if (price === null || promotionPrice === null) { return null; }

    const savingsPercent = Math.round(((price - promotionPrice) * 100) / price);
    if (savingsPercent === 0) { return null; }

    return (
      <View
        style={styles.savingsPercentContainer}
        pointerEvents={'none'}
      >
        <Text style={styles.savingsPercent}>-{savingsPercent}%</Text>
      </View>
    );
  }

  // text block displaying price (with original price + savings, if avail)
  renderPrice(price, promotion_price, item) {
    let mainPriceText = '-';
    let previousPriceText = '';
    let savingsText = '';

    let multiplier = item.increment || 1;

    if (price !== null) {
      mainPriceText = `${(price * multiplier).toFixed(2)} LE`;

      if (promotion_price !== null) {
        mainPriceText = `${(promotion_price * multiplier).toFixed(2)} LE`;
        previousPriceText = `${(price * multiplier).toFixed(2)}`;
        const savingsAmount = price - promotion_price;
        if (savingsAmount !== 0) { savingsText = `وفر ${savingsAmount.toFixed(2)} جنيه`; }
      }
    }

    if (item.unit) {
      mainPriceText += ` / ${multiplier}${item.unit}`;
    } else if (item.increment && item.increment !== 1) {
      mainPriceText += ` / ${item.increment}`;
    }

    return (
      <View style={{ marginRight: 20 }}>
        <Text style={styles.savings}>{savingsText}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.previousPrice}>{previousPriceText}</Text>
          <Text style={styles.mainPrice}>{mainPriceText}</Text>
        </View>
      </View>
    );
  }



  render() {
    const {
      item,
      seller,
      items_array
    } = this.props;

    const { upc, image_url, thumbnail_url, price, promotion_price } = item;
    // derive quantity from working basket hash
    const foundItem = items_array.find((w_item) => (w_item.upc === item.upc));
    const quantity = foundItem ? foundItem.quantity : 0;

    console.log(item);

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ flex: 1, paddingTop: statusBarMargin+40 }}>
        <Image
          style={{ marginLeft: 20, width: (window.width-40), height: (window.width-40)}}
          resizeMode={'contain'}
          defaultSource={loadingCircleGreen}
          source={{ uri: image_url }}
        />
        { this.renderPromotionBadge(price, promotion_price) }

        <Text style={styles.titleText}>{localizeItem(item)}</Text>
        { this.renderPrice(price, promotion_price, item) }
      </ScrollView>

        <View style={{ borderTopWidth: 1, borderColor: '#cecece', height: 80 }}>
          <ItemIncrementer fullscreen item={item} quantity={quantity} seller={seller} style={{ flex: 1, marginLeft: 18, marginRight: 18, marginTop: 12, marginBottom: 12 }} />
        </View>

        <BackButton type={'cross'} />
      </View>
    );
  }

}


const styles = {
  titleText: {
    textAlign: 'right',
    fontSize: 22,
    includeFontPadding: false,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    color: 'black',
  },
  savingsPercentContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: '#F05C64',
    justifyContent: 'center'
  },
  savingsPercent: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    backgroundColor: 'transparent'
  },
  mainPrice: {
    textAlign: 'right',
    fontSize: 22,
    lineHeight: 28,
    height: 24,
    color: 'black',
    backgroundColor: 'transparent'
  },
  previousPrice: {
    fontSize: 20,
    lineHeight: 27,
    height: 24,
      color: 'black',
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
      textAlign: 'right',
      marginRight: 8,
      backgroundColor: 'transparent'
  },
  savings: {
    color: '#F05C64',
    textAlign: 'right',
    fontSize: 18
  },
  priceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: -4,
    paddingLeft: 2,
    backgroundColor: 'transparent'
  },
};

const mapStateToProps = ({ Baskets, Seller }) => {

  const seller = Seller;
  const { items_array } = Baskets.baskets[Seller.id];

  return {
    seller,
    items_array
  };
};

export default connect(mapStateToProps,null)(ItemPage);
