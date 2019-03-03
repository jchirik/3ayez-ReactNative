import React, { Component } from 'react';
import {
  View,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
  BackHandler
} from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import {
  setOrderNotes,
  setPaymentMethod,
  setTip,
  submitOrder
} from '../../actions';
// setPushToken,
// submitOrder,
// setPaymentMethod,
// setDefaultPaymentMethod

import {
  BackButton,
  BlockButton,
  LoadingOverlay,
  AyezText
} from '../_common';
import { Row } from './Row';
import { ReceiptRow } from './ReceiptRow';
import CreditCardSelection from './CreditCardSelection';

import {
  STATUS_BAR_HEIGHT,
  AYEZ_GREEN,
  calculateTotal,
  calculateSuggestedTips,
  paymentIcon,
  isIPhoneX
} from '../../Helpers.js';

import {
  strings,
  translate,
  formatTimestamp,
  formatDay,
  formatCurrency
} from '../../i18n.js';


import images from '../../theme/images'
import { sceneKeys, navigateTo } from '../../router';

const window = Dimensions.get('window');


class Checkout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCardSelectionVisible: false
    };
  }

  // componentDidMount() {
  //   // if (this.props.default_payment) {
  //   //   this.props.setPaymentMethod(this.props.default_payment, this.props.seller.id);
  //   // } else {
  //   //   this.props.setPaymentMethod({ type: 'CASH' }, this.props.seller.id);
  //   // }
  //
  //   // BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  // }


    // componentWillUnmount() {
    //   if (this.props.onUnmount) { this.props.onUnmount(); }
    //   BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
    // }
    //
    // onAndroidBackPress = () => {
    //   Actions.popTo('workingBasket'); // Android back press
    //   return true;
    // }



// move as much of this to the action as possile
  submitOrder() {
    const {
      customer,
      seller,
      coupon,
      items_array,
      payment_method,
      timeslot,
      delivery_fee,
      tip,
      notes,
      address,

      total
    } = this.props;

    this.props.submitOrder({
      customer,
      seller,
      coupon,
      payment_method,
      timeslot,
      delivery_fee,
      tip,
      notes,
      address
    }, items_array, total);
  }


  onCreditCardToggle() {
    // if no credit cards exist, bring directly to credit card creator
    if (this.props.credit_cards.length === 0) {
      navigateTo(sceneKeys.creditCardCreate)
    } else {
      this.setState({ isCardSelectionVisible: true });
    }
  }

  renderPayment() {

    const { payment_method, seller } = this.props;

    let payment_text = strings('PaymentMethod.cash');
    if (payment_method.type === 'CREDIT') {
      payment_text = `**** ${payment_method.last4}`;
    }
    const payment_image = paymentIcon(payment_method.brand, payment_method.type);

    const selectedCircle = (
      <Image
        style={{height: 24, width: 24 }}
        source={images.toggleSelected}
        resizeMode={'contain'}
      />
    );

    const unselectedCircle = (
      <Image
        style={{height: 24, width: 24 }}
        source={images.toggleUnselected}
        resizeMode={'contain'}
      />
    );

    const cashToggle = (
      <TouchableOpacity
        onPress={() => this.props.setPaymentMethod({ type: 'CASH' })}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 50,
          backgroundColor: 'white',
          paddingLeft: 24,
          paddingRight: 24,
          borderBottomWidth: 1,
          borderColor: '#f7f7f7',
        }}>
        <Image
          source={images.cashIcon}
          style={{
            width: 24,
            height: 24,
            marginRight: 10
           }}
          resizeMode={'contain'}
          />
        <AyezText regular style={{
          fontSize: 16,
          color: '#353333'
        }}>{strings('PaymentMethod.cash')}</AyezText>
        <View style={{ flex: 1 }} />
        {(payment_method.type === 'CASH') ? selectedCircle : unselectedCircle}
      </TouchableOpacity>
    );

    const { accepts_card } = seller;

    const noCardsAcceptedComponent = (
      <View style={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <AyezText regular style={{
          fontSize: 12,
          color: 'red'
        }}>{strings('Checkout.noCreditCard')}</AyezText>
      </View>
    )
    const creditToggle = (
      <TouchableOpacity
        onPress={this.onCreditCardToggle.bind(this)}
        disabled={!accepts_card}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 50,
          backgroundColor: 'white',
          paddingLeft: 24,
          paddingRight: 24,
          borderBottomWidth: 1,
          borderColor: '#f7f7f7',
         }}
        >
        <Image
          source={images.creditCardIcon}
          style={{
            width: 24,
            height: 24,
            marginRight: 10
           }}
          resizeMode={'contain'}
          />
        <AyezText regular style={{
          fontSize: 16,
          color: '#353333'
        }}>{strings('PaymentMethod.creditCard')}</AyezText>
        <View style={{ flex: 1 }} />
        {(payment_method.type === 'CREDIT') ? selectedCircle : unselectedCircle}
        {accepts_card ? null : noCardsAcceptedComponent}
      </TouchableOpacity>
    );



    return (
      <View>
        <Row disabled title={strings('Checkout.paymentMethodField')}>
          <Image
            source={payment_image}
            style={{
              width: 24,
              height: 24,
              marginRight: 10
             }}
            resizeMode={'contain'}
            />
          <AyezText bold style={{
            fontSize: 16,
            color: 'black'
          }}>{payment_text}</AyezText>
        </Row>
        { cashToggle }
        { creditToggle }
      </View>
    )
  }

  renderTip() {

    // const { payment_method } = this.props;
    const { total, tip } = this.props;

    // get the suggested tips for the total BEFORE tip
    const tipData = calculateSuggestedTips(total - tip);

    return (
      <View>
        <Row disabled title={strings('Checkout.tipField')}>
          <View>

          <AyezText regular style={{
            fontSize: 12,
            color: '#ffa30f'
          }}>{strings('Checkout.smartTipSuggestions')}</AyezText>
          <FlatList
            data={tipData}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => {
              const color = (item === tip) ? AYEZ_GREEN : '#8E8E93';
              return (
                <TouchableOpacity
                onPress={() => this.props.setTip(item)}
                style={{
                  paddingTop: 3,
                  paddingBottom: 3,
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginRight: 8,
                  marginTop: 10,
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: color
                }}>
                  <AyezText light style={{
                    fontSize: 15,
                    color: color
                  }}>{formatCurrency(item)}</AyezText>
                </TouchableOpacity>
              )
            }}
          />
          </View>
        </Row>

      </View>
    )
  }

  renderCouponReceiptRow() {
    const { coupon } = this.props;
    if (!coupon) { return null; }
    return (
      <ReceiptRow title={strings('Receipt.coupon', { code: coupon.code })} cost={coupon.amount} color={'#D33B2D'} />
    )
  }


  editCheckoutNotes(){
    navigateTo(sceneKeys.additionalNotes, {
      initText: this.props.notes,
      title: strings('Checkout.additionalNotesHeader'),
      onSubmit: (text) => this.props.setOrderNotes(text)
    });
  }

  renderNotes() {
    const { notes } = this.props;

    let notesButtonText = strings('Common.edit')
    if (!notes) { notesButtonText = strings('Common.add') }

    return (
      <View>
        <Row
          onPress={this.editCheckoutNotes.bind(this)}
          title={strings('Checkout.additionalNotesField')}>
          <AyezText regular style={{
            fontSize: 16,
            color: '#0094ff'
          }}>{ notesButtonText }</AyezText>
        </Row>

        <TouchableOpacity
          onPress={this.editCheckoutNotes.bind(this)}
          activeOpacity={1}
          style={{
            backgroundColor: 'white',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 5,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderColor: '#f7f7f7',
          }}>
          <AyezText regular style={{
            fontSize: 14,
            color: '#353333',
            textAlign: 'left'
          }}>{notes}</AyezText>
        </TouchableOpacity>
      </View>
    );
  }

  renderDeliveryTime() {
    const {
      seller,
      timeslot
    } = this.props;

    if (timeslot && (timeslot.type === 'INSTANT')) {
      return (
        <Row disabled title={strings('Checkout.deliveryTimeField')}>
          <View style={{ alignItems: 'flex-end' }}>
            <AyezText regular size={16}>{strings('Common.yalla')}</AyezText>
            <AyezText regular size={13} color={'#8E8E93'}>{strings('StoreSelect.deliveryTime', { delivery_time: seller.delivery_time })}</AyezText>
          </View>
        </Row>
      )
    }

    const timeslotDay = formatDay(timeslotStart);
    const timeslotStart = formatTimestamp(timeslot.start, "h:mmA");
    const timeslotEnd = formatTimestamp(timeslot.end, "h:mmA");
    return (
      <Row disabled title={strings('Checkout.deliveryTimeField')}>
        <AyezText regular style={{
          fontSize: 16,
          color: 'black',
        }}>{timeslotDay} {timeslotStart} - {timeslotEnd}</AyezText>
      </Row>
    )
  }


  // <Text>{this.props.errorMessage}</Text>
  render() {
    const {
      seller,
      coupon,
      subtotal,
      total,
      items_array,

      payment_method,
      timeslot,
      delivery_fee,
      tip,
      notes,

      address
    } = this.props;

    // if (isLoading) {
    //   return (
    //     <View style={{ flex: 1 }}>
    //       <ActivityIndicator size="large" style={{ height: 40, flex: 1 }} />
    //     </View>
    //   );
    // }


    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>

      <BackButton fixed />

      <AyezText bold
      style={{
        fontSize: 28,
        color: 'black',
        marginTop: STATUS_BAR_HEIGHT + 60,
        marginLeft: 20,
        alignSelf: 'flex-start'
      }}>{strings('Checkout.header')}</AyezText>

      <ScrollView style={{ flex: 1 }}>

         <View style={{ height: 18 }} />

        <Row disabled title={strings('Checkout.addressField')}>
          <AyezText regular
          style={{
            fontSize: 16
          }}>{strings('Address.singleLine', {street: address.street, building: address.building, apt: address.apt })}</AyezText>
        </Row>

        <View style={{ height: 18 }} />

        {this.renderDeliveryTime()}

        <View style={{ height: 18 }} />

        {this.renderPayment()}

        <View style={{ height: 18 }} />

        {this.renderTip()}

        <View style={{ height: 18 }} />

        {this.renderNotes()}

        <View style={{ height: 18 }} />



        <AyezText bold
        style={{
          fontSize: 20,
          color: 'black',
          marginTop: 20,
          marginLeft: 20,
          marginBottom: 10,
          alignSelf: 'flex-start'
        }}>{strings('Receipt.summary')}</AyezText>

        <ReceiptRow title={strings('Receipt.subtotal')} cost={subtotal} />
        <ReceiptRow title={strings('Receipt.deliveryFee')} cost={delivery_fee} />
        <ReceiptRow title={strings('Receipt.tip')} cost={tip} />
        { this.renderCouponReceiptRow() }

        <View style={{ marginTop: 6, marginBottom: 6, height: 1, backgroundColor: '#eeeeee' }} />
        <ReceiptRow title={strings('Receipt.total')} cost={total} />




        <View style={{ height: 20 }} />


      </ScrollView>

      <View style={styles.submitButtonContainer}>
        <BlockButton
          text={strings('Checkout.sendOrder')}
          onPress={this.submitOrder.bind(this)}
        />
      </View>

      <CreditCardSelection
        onClose={() => this.setState({ isCardSelectionVisible: false })}
        isVisible={this.state.isCardSelectionVisible}
        />

      <LoadingOverlay isVisible={this.props.is_loading} />

      </View>
      );
    }
  }

  const styles = {
      standardCell: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#EAEAEA',
        borderBottomWidth: 1,
        paddingRight: 16,
        paddingLeft: 16
      },
        submitButtonContainer: {
          paddingTop: 4,
          paddingLeft: 12,
          paddingRight: 12,
          paddingBottom: isIPhoneX() ? 26 : 10,
          borderTopWidth: 1,
          borderColor: '#f4f4f4',
          backgroundColor: 'white'
        },
        notesTitleStyle: {
          marginLeft: 50,
          marginRight: 50,
          textAlign: 'center',
          fontSize: 18,
          fontFamily: 'BahijJanna',
        },
        notesTextStyle: {
          marginLeft: 20,
          marginRight: 20,
          marginTop: 8,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: '#0094ff',
          backgroundColor: '#fff',
          fontSize: 16,
          fontFamily: 'BahijJanna',
          padding: 12,
          textAlign: 'right',
          textAlignVertical: 'top'
        },
        bullseyeOuter: {
          width: 30,
          height: 30,
          borderRadius: 15,
          borderWidth: 1,
          borderColor: '#cecece',
          justifyContent: 'center',
          alignItems: 'center'
        },
        bullseyeSelected: {
          width: 16,
          height: 16,
          backgroundColor: '#00C36C',
          borderRadius: 8
        }
  };


  const mapStateToProps = ({ Baskets, Customer, Seller, Checkout, Coupon, CreditCards, Addresses }) => {

    const customer = Customer;
    const seller = Seller;
    const basket = Baskets.baskets[Seller.id];
    const { subtotal, items_array } = basket;
    // this is for submitting to Checkout in componentDidMount only
    const { coupon } = Coupon;
    const total = calculateTotal(basket, Checkout, coupon);
    // const { coupon_discount } = orderData;

    const {
      payment_method,
      timeslot,
      delivery_fee,
      tip,
      notes,

      is_loading,
      error
    } = Checkout;

    const { credit_cards } = CreditCards;

    const { address } = Addresses;

    return {
      customer,
      seller,
      coupon,
      total,
      subtotal,

      items_array,

      payment_method,
      timeslot,
      delivery_fee,
      tip,
      notes,

      address,

      is_loading,
      error,

      credit_cards
    };

    // coupon_discount,
    // orderTotal: orderData.total.final,
    // originalOrderTotal: orderData.total.original,
    // containsUnpriced: orderData.is_variable,
    // basketQuantity: orderData.basket_quantity
  };
  //
  // const mapStateToProps = ({ WorkingOrders, UX_SubmitOrder, CurrentSeller, CustomerData }) => {
  //
  //   const seller = CurrentSeller;
  //   const { baskets } = WorkingOrders;
  //   const {
  //     items_array,
  //     timeslot,
  //     address,
  //     coupon,
  //     payment_method,
  //     shipment_id,
  //     driver
  //   } = baskets[seller.id];
  //
  //   let {
  //     errorMessage,
  //     isLoading
  //   } = UX_SubmitOrder;
  //
  //   const { name, phone, credit_cards, addresses, default_payment } = CustomerData;
  //
  //   const orderData = calculateOrderData(items_array, coupon, timeslot.delivery_fee);
  //
  //   return {
  //
  //   };
  // };


  export default connect(mapStateToProps,
    {
      setOrderNotes,
      setPaymentMethod,
      setTip,
      submitOrder
    }
  )(Checkout);
