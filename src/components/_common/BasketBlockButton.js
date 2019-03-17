import React, { PureComponent } from 'react';
import { TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { isIPhoneX, AYEZ_GREEN } from '../../Helpers.js';
import { strings, formatCurrency } from '../../i18n.js';
import images from '../../theme/images'


import { AyezText } from '.';
import {sceneKeys, navigateTo} from '../../router';

const window = Dimensions.get('window');


const buttonHeight = isIPhoneX() ? 60 : 48;

class BasketBlockButton extends PureComponent {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    // faster performance this way
    navigateTo(sceneKeys.checkoutFlow, { bluredViewRef: this.props.bluredViewRef });
  }

  render() {
    const { showBasketImage, subtotal } = this.props;
    let isSmallScreen = false;
    if (window.height <= 580) {
      isSmallScreen = true;
    }

    let basketImageComponent = (
      <TouchableOpacity
        onPress={this.onPress}
        activeOpacity={0.85}
      >
      <Image
        source={images.skeuomorphBasket}
        style={{
          width: 300,
          height: 50
        }}
        resizeMode={'stretch'}
      />
      </TouchableOpacity>
    );

    if (isSmallScreen || !showBasketImage) {
      basketImageComponent = null;
    }
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          height: buttonHeight + (showBasketImage ? 50 : 0),
          marginTop: showBasketImage ? 10 : 0,
          marginRight: 6,
          marginLeft: 6,
          alignItems: 'center'
        }}
      >
        {basketImageComponent}

        <TouchableOpacity
          onPress={this.onPress}
          style={{
            backgroundColor: AYEZ_GREEN,
            flex: 1,
            height: buttonHeight,
            justifyContent: 'center',
            flexDirection: 'row',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            marginHorizontal: 6,
            alignSelf: 'stretch'
          }}
          activeOpacity={0.85}
        >
          <View
            style={{
              alignSelf: 'flex-start',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 7
            }}
          >
            <AyezText medium size={15} color={'white'}>{strings('Common.myBasket')}</AyezText>
          </View>

          <View
            style={{
              position: 'absolute',
              backgroundColor: '#09bc61',
              top: 6,
              left: 10,
              height: 25,
              width: 30,
              paddingLeft: 1,
              borderRadius: 4,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <AyezText medium color={'white'}>{this.props.basket_quantity}</AyezText>
          </View>

          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 12
            }}
          >
            <AyezText medium color={'white'}>{formatCurrency(subtotal)}</AyezText>

          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = ({ Seller, Baskets }) => {
  const basket = Baskets.baskets[Seller.id] || {};
  const { subtotal, basket_quantity } = basket;
  return {
    subtotal,
    basket_quantity
  };
};

export default connect(
  mapStateToProps,
  null
)(BasketBlockButton);
