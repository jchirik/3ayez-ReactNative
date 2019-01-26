import React, { PureComponent } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  Image,
  PanResponder,
  Animated
} from 'react-native';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';

import { translate, strings } from '../../i18n.js';

import {
  addToBasket
} from '../../actions';

import { ItemIncrementer } from '../_reusable';

const loadingCircleGreen = require('../../../assets/images/loading_circle_green.png');

const scaleImage = require('../../../assets/images/scale.png');

// const ImgCacheLib = require('react-native-img-cache');
// const CachedImage = ImgCacheLib.CachedImage;

// let CachedImage = Image;
// if (Platform.OS === 'android') {
//     const ImgCacheLib = require('react-native-img-cache');
//     CachedImage = ImgCacheLib.CachedImage;
// }

class ItemCell extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1)
    };
  }

  componentWillMount() {
  this._panResponder = PanResponder.create({

    onMoveShouldSetResponderCapture: (e, { dx, dy }) => {
      if ((dy > Math.abs(dx)) && (dy > 0)) { return true; }
      return false;
    },
    onMoveShouldSetPanResponderCapture: (e, { dx, dy }) => {
      if ((dy > Math.abs(dx)) && (dy > 0)) { return true; }
      return false;
    },

    // Initially, set the value of x and y to 0 (the center of the screen)
    onPanResponderGrant: (e, {vx, vy}) => {
      console.log('starting', vx, vy)
      // this.state.pan.setValue({x: 0, y: 0});
      // this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
      this.props.onDragStart();
      Animated.spring(
        this.state.scale,
        { toValue: 1.1, friction: 3 }
      ).start();
    },

    // When we drag/pan the object, set the delate to the states pan position
    // onPanResponderMove: Animated.event([
    //   null, {dx: this.state.pan.x, dy: this.state.pan.y},
    // ]),


    onPanResponderMove: (e, gestureState) => {
      const { dx, dy } = gestureState;
      console.log(dx, dy);
      Animated.event([ null, {dx: this.state.pan.x, dy: this.state.pan.y}, ])(e, gestureState);
    },

    onPanResponderRelease: (e, {dx, dy}) => {
      this.props.onDragEnd();
      this.state.pan.flattenOffset(); // Flatten the offset to avoid erratic behavior
      console.log('released')
      Animated.spring(
         this.state.scale,
         { toValue: 1, friction: 3 }
       ).start();

       if (dy <= 100) {
         Animated.spring(
           this.state.pan, // Auto-multiplexed
           {toValue: {x: 0, y: 0}} // Back to zero
         ).start();
       } else {
         Animated.timing(
            // Uses easing functions
            this.state.pan, // The value to drive
            {
              toValue: {x: dx, y: dy+500},
              duration: 200,
            } // Configuration
          ).start(() => {

            // place it back where it started
            console.log('added to basket');
            this.props.addToBasket(this.props.item, this.props.seller.id);
            this.state.scale.setValue(0);
            this.state.pan.setValue({x: 0, y: 0});
            Animated.spring(
               this.state.scale,
               { toValue: 1, friction: 5 }
             ).start();
          });
       }

       // Animated.timing(
       //   // Animate value over time
       //   this.state.fadeAnim, // The value to drive
       //   {
       //     toValue: 1, // Animate to final value of 1
       //   }
       // ).start();



    }
  });
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

  renderMaxBadge(max_per_basket) {
    if (!max_per_basket) { return null; }

    return (
      <View
        style={styles.maxPerBasketContainer}
        pointerEvents={'none'}
      >
        <Text style={styles.maxPerBasketText}>{strings('Item.limit')} {max_per_basket}</Text>
      </View>
    );
  }

  renderScale(item) {
    if (item.unit && (item.unit == 'g' || item.unit == 'kg')) {
      return (
        <Image style={{ position: 'absolute', right: 5, bottom: 0, width: 26, height: 26}}
          source={scaleImage}
        />
      );
    }

    return null;
  }

  // text block displaying price (with original price + savings, if avail)
  renderPrice(price, promotion_price, item) {
    let mainPriceText = '-';
    let previousPriceText = '';
    let savingsText = '';

    if (price !== null) {
      mainPriceText = `${price.toFixed(2)} LE`;

      if (promotion_price !== null) {
        mainPriceText = `${promotion_price.toFixed(2)} LE`;
        previousPriceText = `${price.toFixed(2)}`;
        const savingsAmount = price - promotion_price;
        if (savingsAmount !== 0) { savingsText = `وفر ${savingsAmount.toFixed(2)} جنيه`; }
      }
    }

    if (item.incr && item.unit) {
      mainPriceText += ` / ${item.incr}${item.unit}`;
    } else if (item.incr && item.incr !== 1) {
      mainPriceText += ` / ${item.incr}`;
    }

    return (
      <View>
        <Text style={styles.savings}>{savingsText}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.previousPrice}>{previousPriceText}</Text>
          <Text style={styles.mainPrice}>{mainPriceText}</Text>
        </View>
      </View>
    );
  }


  render() {
    const { item, seller, height, width, items_array, row } = this.props;
    const { upc, image_url, thumbnail_url, price, promotion_price, max_per_basket } = item;
    const { pan, scale } = this.state;


    // derive quantity from working basket hash
    const foundItem = items_array.find((w_item) => (w_item.upc === item.upc));
    const quantity = foundItem ? foundItem.quantity : 0;


    const cellPadding = 6;



    // <Draggable renderShape='image' imageSource={{ uri: image_url, cache: 'force-cache' }} renderSize={width}
    //     x={0} y={0} z={0}
    //     reverse={false}
    //     longPressDrag={()=>console.log('long press')}
    //     pressOutDrag={()=> {
    //       console.log('out press')
    //     }}
    //     pressDrag={()=> {
    //       this.props.onDragEnd();
    //       console.log('pressed')
    //     }}
    //     pressDragRelease={(e, gestureState)=> {
    //       console.log('end')
    //       console.log(gestureState.dx, gestureState.dy)
    //       this.props.onDragEnd();
    //     }}
    //     pressInDrag={()=> {
    //       console.log('start')
    //       this.props.onDragStart();
    //     }}
    // />let rotate = '0deg';

    return (
    <View
      style={{
        height,
        width,
        padding: cellPadding,
        flexDirection: 'column',
        alignItems: 'stretch',
        zIndex: (row === 1) ? 50 : 100
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          maxHeight: 150,
          transform: [{translateX: pan.x}, {translateY: pan.y}, { scale }],
          zIndex: 200
        }}
        {...this._panResponder.panHandlers}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={0.8}
          onPress={() => Actions.itemPage({ item: this.props.item })}
          >
          <Image
            style={{ flex: 1 }}
            resizeMode={'contain'}
            defaultSource={loadingCircleGreen}
            source={{ uri: thumbnail_url }}
          />
        </TouchableOpacity>
        { this.renderPromotionBadge(price, promotion_price) }
        { this.renderMaxBadge(max_per_basket) }
        { this.renderScale(item) }
      </Animated.View>

      { this.renderPrice(price, promotion_price, item) }
      <Text style={styles.titleText}>{translate(item)}</Text>
      <ItemIncrementer item={item} quantity={quantity} seller={this.props.seller} style={{ marginTop: 6 }} />
    </View>
    );
  }
}


const styles = {
    titleText: {
      opacity: 1,
      textAlign: 'right',
      fontSize: 15,
      lineHeight: 18,
      marginTop: 4,
      includeFontPadding: false,
      paddingLeft: 3,
      paddingRight: 3,
      color: 'black',
      paddingBottom: 5, // added for android
      height: 35,
      backgroundColor: 'transparent'
    },
  mainPrice: {
    textAlign: 'right',
    fontSize: 15,
    lineHeight: 18,
    height: 16,
    marginRight: 3,
    color: 'black',
    backgroundColor: 'transparent'
  },
  previousPrice: {
    fontSize: 15,
      lineHeight: 18,
      height: 16,
      color: 'black',
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
      textAlign: 'right',
      marginRight: 3,
      backgroundColor: 'transparent'
  },
  savings: {
    color: '#F05C64',
    textAlign: 'right',
    fontSize: 14,
    lineHeight: 17,

    marginBottom: 2,
    height: 15,
    marginRight: 3,
    backgroundColor: 'transparent'
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
    savingsPercentContainer: {
      position: 'absolute',
      top: 4,
      left: 5,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F05C64',
      justifyContent: 'center'
    },
    maxPerBasketContainer: {
      position: 'absolute',
      bottom: 5,
      left: 5,
      height: 24,
      borderRadius: 9,
      backgroundColor: '#0094ff',
      justifyContent: 'center'
    },
    savingsPercent: {
      textAlign: 'center',
      fontSize: 15,
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
    }
};

const mapStateToProps = ({ Baskets, Seller }) => {

  const seller = Seller;
  const {
    items_array
  } = Baskets.baskets[Seller.id];

  return {
    seller,
    items_array
  };
};

export default connect(mapStateToProps, {
  addToBasket
})(ItemCell);
