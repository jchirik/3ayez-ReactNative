import _ from 'lodash';
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  FlatList,
  BackHandler
} from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
// import call from 'react-native-phone-call';
import {
  emptyBasket,
  resetCoupon,
  onCompleteAuth
} from '../../actions';
import {
  BlockButton,
  BackButton,
  ItemCell,
  ModalPanel
} from '../_reusable';

import {
  strings,
  localizeDN,
  statusBarMargin,
  calculateTotal
} from '../../Helpers.js';

const window = Dimensions.get('window');
const skeuomorphBasket = require('../../../assets/images/skeuomorph_basket.png');
const chatButtonImage = require('../../../assets/images/chat.png');

import CouponBanner from './CouponBanner';

class WorkingBasket extends Component {

  constructor(props) {
    super(props);

    this.state = {
      clearBasketModal: false,
      belowMinimumModal: false
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  onAndroidBackPress = () => {
    Actions.pop(); // Android back press
    return true;
  }



  // callStore() {
  //   call({ number: this.props.seller.phone, prompt: true });
  // }

  renderHeader() {

    // before price
    let beforePrice = null;
    if (this.props.coupon) {
      beforePrice = (
        <Text style={styles.beforePrice}>
          {this.props.subtotal.toFixed(2)}
        </Text>
      );
    }



    // after price
    const afterPrice = (
      <Text style={[
        styles.afterPrice,
        { color: (this.props.coupon) ? '#b413c6' : 'black'}
      ]}>
        {`${this.props.total.toFixed(2)} LE`}
      </Text>
    );

    //
    // let priceNotes = null;
    // if (this.props.coupon && !this.props.coupon_discount) {
    //   priceNotes = (
    //     <Text style={{
    //       fontSize: 18,
    //       fontFamily: 'BahijJanna',
    //         color: '#b413c6',
    //         marginRight: 6
    //     }}>
    //       (min. {this.props.coupon.minimum} for coupon)
    //     </Text>
    //   );
    // }

    return (
      <View style={styles.headerContainer}>

        <View style={{
          position: 'absolute',
          width: window.width, height: 50, top: statusBarMargin,
          justifyContent: 'center', alignItems: 'center'
        }}>
          <Image
            source={skeuomorphBasket}
            style={{
              width: 300,
              height: 50,

            }}
            resizeMode={'stretch'}
          />
        </View>

        {/* price */}
        <Text style={styles.subtotalLabel}>{strings('WorkingBasket.subtotal')}</Text>
        <View style={styles.priceContainer}>
          {afterPrice}
          {beforePrice}
        </View>
        { /* <Text style={styles.callButtonText}>{strings('WorkingBasket.callForProblem')}</Text> */}

        {/* back button */}
        <BackButton type={'cross'} />
      </View>
    );
  }

  // {/* basket quantity */}
  // <Text style={styles.basketQuantity}>{this.props.basketQuantity}</Text>


  renderItem({ item }) {
    return (
      <ItemCell
        item={item}
        mutableQuantity
        seller={this.props.seller}
      />
    );
  }




  renderTableFooter() {

    const clearButton = (this.props.items_array.length === 0) ? null : (
      <TouchableOpacity
        style={{
          marginTop: 20,
          marginBottom: 36,
          padding: 4,
          width: 130,
          alignSelf: 'center'
        }}
        onPress={() => this.setState({ clearBasketModal: true })}
      >
        <Text style={styles.clearOrderTextStyle}>
          {strings('WorkingBasket.clearOrder')}
        </Text>
      </TouchableOpacity>
    );

    return (
      <View>
        {clearButton}
      </View>
    );
  }
  // PREVIOUS VERSION WITH COUPON
  // renderTableFooter() {
  //   return (
  //     <View style={{ marginBottom: 20, marginTop: 10 }}>
  //       <CouponBanner
  //         coupon={this.props.coupon}
  //         onApply={() => this.props.toggleCouponModal({ welcome: false })}
  //         onRemove={() => this.props.resetCoupon()}
  //         mutable
  //       />
  //       <View style={{ marginTop: 35, alignItems: 'center' }}>
  //         <TouchableOpacity
  //           style={{ padding: 4, width: 130 }}
  //           onPress={() => this.props.clearOrder()}
  //         >
  //         <Text style={styles.clearOrderTextStyle}>
  //           {'مسح كل المشتريات'}
  //         </Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // }



  //  ListHeaderComponent={this.renderAddressHeader()}
  renderTable() {
    if (this.props.inventoryLoading) {
      return (<ActivityIndicator />);
    }
    return (
      <FlatList
      data={this.props.items_array}
      renderItem={this.renderItem.bind(this)}
      style={{ flex: 1, backgroundColor: 'white' }}
      ListFooterComponent={this.renderTableFooter()}
      ListEmptyComponent={
        <Text style={styles.emptyCartStyle}>
          {strings('WorkingBasket.nothingInBasket')}
        </Text>
      }
      keyExtractor={(item, index) => index}
      />
    );
  }

    onContinuePress() {

      const { seller, subtotal } = this.props;

      if (seller.minimum && subtotal < seller.minimum) {
        // below the minimum, so indicate in a popup
        this.setState({ belowMinimumModal: true })
      } else {
        Actions.timeslotSelect();
        // continue onwards
        // Actions.checkoutFlow({ isLoggedIn: (firebase.auth().currentUser) });
      }
    }


    renderCouponButton() {
      let couponText = strings('CouponBanner.addCoupon')

      return (
        <BlockButton
            text={couponText}
            outline
            style={{ marginBottom: 5, shadowOpacity: 0, elevation: 0 }}
            onPress={() => console.log('Open Coupon Modal')}
            color='#b413c6'
          />
      );
    }

    renderBottomButton() {

      if (!this.props.phone) {
        return (
          <View style={styles.submitButtonContainer}>
            <BlockButton
              text={'Please Signup to Continue'}
              onPress={() => {
                // proceed to address create after auth
                this.props.onCompleteAuth(() => Actions.popTo('workingBasket'))
                Actions.auth();
              }}
              color='#0094ff'
            />
          </View>
        );
      }

      return (
        <View style={styles.submitButtonContainer}>
          { this.renderCouponButton() }
          <BlockButton
            text={strings('WorkingBasket.submitButton')}
            onPress={this.onContinuePress.bind(this)}
            color='#00C36C'
          />
        </View>
      );
    }

  render() {

    const { seller } = this.props;
    const sellerName = localizeDN(seller.display_name);

    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        {this.renderTable()}
        {this.renderBottomButton()}

        <ModalPanel
          type={'bigButton'}
          button1Text={strings('WorkingBasket.clearOrderModalButton')}
          onButton1Press={() => {
            this.props.emptyBasket(this.props.seller.id);
            this.setState({ clearBasketModal: false });
          }}
          button1Color={'red'}
          onClose={() => this.setState({ clearBasketModal: false })}
          visible={this.state.clearBasketModal}
        >
          <View style={{ backgroundColor: 'transparent', margin: 20 }}>
            <Text style={{ fontSize: 18, textAlign: 'center' }}>
              {strings('WorkingBasket.clearOrderModalHeader')}
            </Text>
          </View>
        </ModalPanel>


        <ModalPanel
          type={'bigButton'}
          button1Text={'OK'}
          onButton1Press={() => {
            this.setState({ belowMinimumModal: false });
          }}
          onClose={() => this.setState({ belowMinimumModal: false })}
          visible={this.state.belowMinimumModal}
        >
          <View style={{ backgroundColor: 'transparent', margin: 20 }}>
            <Text style={{ fontSize: 18, textAlign: 'center' }}>
              min. {seller.minimum} EGP for {sellerName}
            </Text>
          </View>
        </ModalPanel>


      </View>
      );
    }
  }

  const styles = {
    // header components
    headerContainer: {
      height: 110 + statusBarMargin,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 9,
      borderBottomWidth: 1,
      borderColor: '#E9E9E9'
    },
    subtotalLabel: {
      position: 'absolute',
      right: 15,
      fontSize: 16,
      height: 21,
      top: statusBarMargin + 54,
      color: '#cecece',
    },
    priceContainer: {
      position: 'absolute',
      right: 15,
      top: statusBarMargin + 70,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      alignItems: 'flex-end'
    },
    beforePrice: {
      height: 40,
      fontSize: 24,
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
      marginLeft: 7
    },
    afterPrice: {
      height: 40,
      fontSize: 24,
      color: 'black',
    },
    callButton: {
      position: 'absolute',
      top: statusBarMargin + 60,
      left: 12,
      borderRadius: 30,
      height: 45,
      width: 80,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0f5fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    callButtonText: {
      color: '#fff',
      fontSize: 15,
    },

    addressContainer: {
      backgroundColor: '#F9F9F9',
      borderBottomWidth: 1,
      borderColor: '#E9E9E9',
      padding: 14,
      paddingTop: 10,
      paddingBottom: 10
    },

    submitButtonContainer: {
      paddingTop: 4,
      paddingLeft: 12,
      paddingRight: 12,
      paddingBottom: 10,
      borderTopWidth: 1,
      borderColor: '#f4f4f4',
      backgroundColor: 'white'
    },


    clearOrderTextStyle: {
      textAlign: 'center',
      color: '#F05C64',
      fontSize: 18
    },
    emptyCartStyle: {
      fontSize: 18,
      textAlign: 'center',
      color: 'black',
      marginTop: 25,
      flex: 1
    },
    addAddress: {
      backgroundColor: '#F9F9F9',
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: '#E9E9E9',
      justifyContent: 'center',
      height: 80
    }
  };

  const mapStateToProps = ({ Customer, Baskets, Seller, Checkout, Coupon }) => {

    const { phone } = Customer;
    const seller = Seller;
    const basket = Baskets.baskets[Seller.id];
    // this is for submitting to Checkout in componentDidMount only

    const { items_array, subtotal, basket_quantity } = basket;
    const { coupon } = Coupon;

    const total = calculateTotal(basket, Checkout, coupon);
    // const { coupon_discount } = orderData;

    return {
      phone,
      items_array,
      subtotal,
      basket_quantity,
      coupon,
      seller,
      total
    };

    // coupon_discount,
    // orderTotal: orderData.total.final,
    // originalOrderTotal: orderData.total.original,
    // containsUnpriced: orderData.is_variable,
    // basketQuantity: orderData.basket_quantity
  };

  export default connect(mapStateToProps,
    {
      emptyBasket,
      resetCoupon,
      onCompleteAuth
    }
  )(WorkingBasket);
