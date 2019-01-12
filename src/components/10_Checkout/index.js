import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
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

import Moment from 'moment';
import { Actions } from 'react-native-router-flux';
import {
  submitOrder
} from '../../actions';
// setPushToken,
// submitOrder,
// setPaymentMethod,
// setDefaultPaymentMethod

import {
  BackButton,
  BlockButton,
  LoadingOverlay
} from '../_common';
import { Row } from './Row';
import { ReceiptRow } from './ReceiptRow';

import {
  STATUS_BAR_HEIGHT,

  calculateTotal,

  strings,
  parsePayment,
  calculateOrderData
} from '../../Helpers.js';


const cash_icon = require('../../../assets/images_v2/Payment/cash.png');
const creditcard_icon = require('../../../assets/images_v2/Payment/credit-card.png');

const window = Dimensions.get('window');


class Checkout extends Component {

  constructor(props) {
    super(props);
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
      address
    } = this.props;

    this.props.submitOrder({
      customer,
      seller,
      coupon,
      items_array,
      payment_method,
      timeslot,
      delivery_fee,
      tip,
      notes,
      address
    });
  }



  renderNotes() {
    return null;
    return (
      <View style={{marginTop: 20}}>
      <Text style={styles.notesTitleStyle}>{strings('Checkout.notesTitle')}</Text>
      <TextInput
      height={140}
      maxLength={240}
      multiline = {true}
      style={styles.notesTextStyle}
      onChangeText={(notes) => this.setState({ notes })}
      value={this.state.notes}
      underlineColorAndroid='transparent'
      />
      </View>
    );
  }





  renderAddressCell() {

    const { address } = this.props;
    if (!address) { return null; }

    const addressText = `${address.street}, ${address.building}, ${address.apt}`;

    return (
      <View style={styles.standardCell}>
        <Text
          style={[
            styles.standardCellText,
            { color: '#00C36C', maxWidth: window.width-110 }
          ]}
          numberOfLines={1}
        >{addressText}</Text>
        <Text
          style={styles.standardCellText}
        >{strings('Checkout.addressTitle')}</Text>
      </View>
    );
  }

  renderCouponCell() {

    const { coupon } = this.props;
    if (!coupon) { return null; }

    return (
      <View style={styles.standardCell}>
        <Text
          style={[
            styles.standardCellText,
            { maxWidth: window.width-110 }
          ]}
          numberOfLines={1}
        >{coupon.code}</Text>
        <Text
          style={styles.standardCellText}
        >{strings('Checkout.couponTitle')}</Text>
      </View>
    );
  }


  renderPaymentCell() {
    const { payment_method } = this.props;

    const { text, icon } = parsePayment(payment_method);

    return (
      <TouchableOpacity
        onPress={() => this.setState({ isPaymentToggled: !this.state.isPaymentToggled })}
        style={styles.standardCell}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center' }}>
          <Text style={styles.standardCellText}>{text}</Text>
          <Image
            style={{height: 40, width: 40, marginLeft: 10 }}
            source={icon}
            resizeMode={'contain'}
          />
        </View>
        <Text
          style={styles.standardCellText}
        >{strings('Checkout.paymentTitle')}</Text>
      </TouchableOpacity>
    );
  }


  onSelectPaymentMethod(method) {

    if (method.type === 'ADDCARD') {
      Actions.addCreditCard();
    } else {
      this.props.setPaymentMethod(method, this.props.seller.id);
      this.props.setDefaultPaymentMethod(method);
      this.setState({ isPaymentToggled: false });
    }
  }


  renderPaymentMethodCell(method) {
    const { payment_method } = this.props;

    const isSelected = ((method.type === payment_method.type) && (method.card_id === payment_method.card_id));
    const { text, icon } = parsePayment(method);

    return (
      <TouchableOpacity
        onPress={this.onSelectPaymentMethod.bind(this, method)}
        style={styles.standardCell}
        activeOpacity={0.8}
      >

        <View style={styles.bullseyeOuter}>
            <View style={(isSelected ? styles.bullseyeSelected : null)} />
        </View>

        <View style={{ flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center' }}>
          <Text style={styles.standardCellText}>{text}</Text>
          <Image
            style={{height: 40, width: 40, marginLeft: 10 }}
            source={icon}
            resizeMode={'contain'}
          />
        </View>
      </TouchableOpacity>
    );
  }

  renderPaymentMethods() {

    const { credit_cards } = this.props;

    if (!this.state.isPaymentToggled) { return null; }

// CLEAN THIS UP, make a uniform method for saving + display paymentOptions internally
// ONLY push the

    let paymentMethods = [
        { type: 'CASH' },
        { type: 'CARDREADER' },
        { type: 'ADDCARD' }
    ];
    const creditCardMethods = []
    credit_cards.forEach((card) => {
      creditCardMethods.push({
        type: 'CREDIT',
        card_id: card.id,
        last4: card.last4,
        brand: card.brand
      });
    });
    paymentMethods = [ ...creditCardMethods, ...paymentMethods ];

    return paymentMethods.map(method => this.renderPaymentMethodCell(method));
  }


  renderPayment() {

    const { payment_method } = this.props;

    let payment_text = null;
    let payment_image = null;

    if (payment_method === 'CASH') {
      payment_text = 'Cash';
      payment_image = cash_icon;
    } else if (payment_method === 'CREDIT') {
      payment_text = 'Credit Card';
      payment_image = creditcard_icon;
    }

    return (
      <Row disabled title={'Payment Method :'}>
        <Image
          source={payment_image}
          style={{
            width: 24,
            height: 24,
            marginRight: 10
           }}
          resizeMode={'contain'}
          />
        <Text style={{
          fontSize: 16,
          color: 'black',
          fontFamily: 'Poppins-Bold'
        }}>{payment_text}</Text>
      </Row>
    )
  }

  renderCouponReceiptRow() {
    const { coupon } = this.props;
    if (!coupon) { return null; }
    return (
      <ReceiptRow title={`Coupon (${coupon.code})`} cost={coupon.amount} color={'#D33B2D'} />
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
    const timeslotDay = Moment(timeslotStart).locale('ar').calendar(null, {
      sameDay: '[اليوم]',
      nextDay: '[غدًا]',
      nextWeek: 'dddd',
      sameElse: 'L'
    });
    const timeslotStart = Moment(timeslot.start).locale('en-gb').format("h:mmA");
    const timeslotEnd = Moment(timeslot.end).locale('en-gb').format("h:mmA");

    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>

      <BackButton fixed />

      <Text
      style={{
        fontSize: 28,
        color: 'black',
        fontFamily: 'Poppins-Bold',
        marginTop: STATUS_BAR_HEIGHT + 60,
        marginLeft: 20
      }}>Checkout</Text>

      <ScrollView style={{ flex: 1 }}>

         <View style={{ height: 18 }} />

        <Row disabled title={'Address :'}>
          <Text
          style={{
            fontSize: 16,
            color: 'black',
            fontFamily: 'Poppins-Regular'
          }}>{address.street}, Building {address.building}, Apt {address.apt}</Text>
        </Row>

        <View style={{ height: 18 }} />

        <Row disabled title={'Delivery Time :'}>
          <Text style={{
            fontSize: 16,
            color: 'black',
            fontFamily: 'Poppins-Regular'
          }}>{timeslotDay} {timeslotStart} - {timeslotEnd}</Text>
        </Row>

        <View style={{ height: 18 }} />

        {this.renderPayment()}

        <View style={{ height: 18 }} />

        <Text
        style={{
          fontSize: 20,
          color: 'black',
          fontFamily: 'Poppins-Bold',
          marginTop: 20,
          marginLeft: 20,
          marginBottom: 10
        }}>Summary</Text>

        <ReceiptRow title={'Subtotal'} cost={subtotal} />
        <ReceiptRow title={'Delivery Cost'} cost={delivery_fee} />
        <ReceiptRow title={'Tip'} cost={0} />
        { this.renderCouponReceiptRow() }

        <View style={{ marginTop: 6, marginBottom: 6, height: 1, backgroundColor: '#eeeeee' }} />
        <ReceiptRow title={'Total'} cost={total} />

        <View style={{ height: 20 }} />


      </ScrollView>

      <View style={styles.submitButtonContainer}>
        <BlockButton
          text={'SEND ORDER'}
          onPress={this.submitOrder.bind(this)}
        />
      </View>

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
          paddingBottom: 10,
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


  const mapStateToProps = ({ Baskets, Customer, Seller, Checkout, Coupon, Addresses }) => {

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

    const { addresses, address_index } = Addresses;
    const address = addresses[address_index];

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
      error
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
      submitOrder
    }
  )(Checkout);
