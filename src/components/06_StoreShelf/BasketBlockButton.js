import React, { PureComponent } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { isIPhoneX } from '../../Helpers.js';


import { strings } from '../../i18n.js';

const window = Dimensions.get('window');

const basketIcon = require('../../../assets/images/basket.png');

const skeuomorphBasket = require('../../../assets/images/skeuomorph_basket.png');

const buttonHeight = isIPhoneX() ? 54 : 42;

class BasketBlockButton extends PureComponent {

  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }


  onPress() {
    // faster performance this way
    Actions.workingBasket()
  }


  renderCouponBadge() {
    const { coupon } = this.props;

    if (!coupon) { return null; }

    let typeText = 'off';
    if (coupon.type === 'pound_discount') { typeText = 'EGP'; }
    else if (coupon.type === 'percent_discount') { typeText = '%'; }

    console.log(this.props.coupon)

    return (
      <View
        style={{
          position: 'absolute',
          borderRadius: 10,
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 4,
          paddingBottom: 4,
          left: 8,
          top: 8,
          backgroundColor: '#b413c6',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 2
        }}
      >

        <View style={{ flexDirection: 'row' }}>
          <Text style={{
            color: 'white',
            fontSize: 16
          }}>{coupon.code} : </Text>

          <Text style={{
            color: 'white',
            fontSize: 16
          }}> -{coupon.amount} {typeText}
          </Text>
        </View>
      </View>
    );
  }


  render() {

    console.log(window.height, 'HEIGHT')

    let isSmallScreen = false;
    if (window.height <= 580) { isSmallScreen = true; }


    let basketImageComponent = (
      <Image
        source={skeuomorphBasket}
        style={{
          width: 300,
          height: 50
        }}
        resizeMode={'stretch'}
      />
    );

    if (isSmallScreen) {
      basketImageComponent = null;
    }

    // { this.renderCouponBadge() }
  return (
    <View style={{
      height: (isSmallScreen ? buttonHeight : buttonHeight+50),
      marginTop: 5,
      marginRight: 6,
      marginLeft: 6,
      alignItems: 'center'
    }}>

    { basketImageComponent }
    <TouchableOpacity
      onPress={this.onPress}
      style={{
        backgroundColor: '#F05C64',
        flex: 1,
        height: buttonHeight,
        justifyContent: 'center',
        flexDirection: 'row',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: -1, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
        alignSelf: 'stretch'
      }}
      activeOpacity={0.85}
    >
      <View style={{
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 5.5
      }}>
      <Image
        source={basketIcon}
        style={{
          width: 18,
          height: 18,
          marginRight: 7
        }}
      />
      <Text style={styles.textStyle}>
        {strings('ShoppingComponent.basketButtonTitle')}
      </Text>
      </View>


      <View style={{
        position: 'absolute',
        backgroundColor: '#E8434C',
        top: 6,
        left: 10,
      }}
      >
       <Text style={{
         textAlign: 'center',
         flex: 1,
         color: '#fff',
         fontSize: 18,
         paddingLeft: 6,
         paddingRight: 6
       }}
          >
           {this.props.basket_quantity}
        </Text>
      </View>

      <View style={{
        position: 'absolute',
        top: 6.5,
        right: 10,
      }}
      >
       <Text style={{
         textAlign: 'center',
         flex: 1,
         color: '#fff',
         fontSize: 17,
         paddingRight: 2
       }}
          >
           {this.props.subtotal ? `${this.props.subtotal.toFixed(2)} EGP` : '-'}
        </Text>
      </View>

    </TouchableOpacity>
    </View>
  );
}

};

const styles = {
  textStyle: {
    color: '#fff',
    fontSize: 18
  }
};

const mapStateToProps = ({ Seller, Baskets }) => {
  const { subtotal, basket_quantity } = Baskets.baskets[Seller.id];
  return {
    subtotal,
    basket_quantity
  };
};

export default connect(mapStateToProps, null)(BasketBlockButton);
