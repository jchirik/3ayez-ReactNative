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

import Moment from 'moment';
import { Actions } from 'react-native-router-flux';
import {
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
  paymentIcon
} from '../../Helpers.js';

import {
  strings,
  translate
} from '../../i18n.js';

const cash_icon = require('../../../assets/images_v2/Payment/cash.png');
const creditcard_icon = require('../../../assets/images_v2/Payment/credit-card.png');

const toggle_selected = require('../../../assets/images_v2/Common/toggle_selected.png');
const toggle_unselected = require('../../../assets/images_v2/Common/toggle_unselected.png');


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
      address
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
    }, items_array);
  }


  onCreditCardToggle() {
    // if no credit cards exist, bring directly to credit card creator
    if (this.props.credit_cards.length === 0) {
      Actions.creditCardCreate();
    } else {
      this.setState({ isCardSelectionVisible: true });
    }
  }

  renderPayment() {

    const { payment_method } = this.props;

    let payment_text = 'Cash';
    if (payment_method.type === 'CREDIT') {
      payment_text = `**** ${payment_method.last4}`;
    }
    const payment_image = paymentIcon(payment_method.brand, payment_method.type);

    const selectedCircle = (
      <Image
        style={{height: 24, width: 24 }}
        source={toggle_selected}
        resizeMode={'contain'}
      />
    );

    const unselectedCircle = (
      <Image
        style={{height: 24, width: 24 }}
        source={toggle_unselected}
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
          source={cash_icon}
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
        }}>Cash</AyezText>
        <View style={{ flex: 1 }} />
        {(payment_method.type === 'CASH') ? selectedCircle : unselectedCircle}
      </TouchableOpacity>
    );
    const creditToggle = (
      <TouchableOpacity
        onPress={this.onCreditCardToggle.bind(this)}
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
          source={creditcard_icon}
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
        }}>Credit Card</AyezText>
        <View style={{ flex: 1 }} />
        {(payment_method.type === 'CREDIT') ? selectedCircle : unselectedCircle}
      </TouchableOpacity>
    );
    return (
      <View>
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
        <Row disabled title={'Tip: '}>
          <View>

          <AyezText regular style={{
            fontSize: 12,
            color: '#ffa30f'
          }}>Smart tip suggestions help you round your total</AyezText>
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
                  }}>{item.toFixed(2)} EGP</AyezText>
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
      <ReceiptRow title={`Coupon (${coupon.code})`} cost={coupon.amount} color={'#D33B2D'} />
    )
  }


  renderNotes() {
    const { notes } = this.props;

    let notesButtonText = 'Edit'
    if (!notes) { notesButtonText = 'Add' }

    return (
      <View>
        <Row
          onPress={() => Actions.checkoutNotesDetail()}
          title={'Additional Notes :'}>
          <AyezText regular style={{
            fontSize: 16,
            color: '#0094ff'
          }}>{ notesButtonText }</AyezText>
        </Row>

        <TouchableOpacity
          onPress={() => Actions.checkoutNotesDetail()}
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
            color: '#353333'
          }}>{notes}</AyezText>
        </TouchableOpacity>
      </View>
    );
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

      <AyezText bold
      style={{
        fontSize: 28,
        color: 'black',
        marginTop: STATUS_BAR_HEIGHT + 60,
        marginLeft: 20
      }}>Checkout</AyezText>

      <ScrollView style={{ flex: 1 }}>

         <View style={{ height: 18 }} />

        <Row disabled title={'Address :'}>
          <AyezText regular
          style={{
            fontSize: 16,
            color: 'black',
          }}>{address.street}, Building {address.building}, Apt {address.apt}</AyezText>
        </Row>

        <View style={{ height: 18 }} />

        <Row disabled title={'Delivery Time :'}>
          <AyezText regular style={{
            fontSize: 16,
            color: 'black',
          }}>{timeslotDay} {timeslotStart} - {timeslotEnd}</AyezText>
        </Row>

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
          marginBottom: 10
        }}>Summary</AyezText>

        <ReceiptRow title={'Subtotal'} cost={subtotal} />
        <ReceiptRow title={'Delivery Cost'} cost={delivery_fee} />
        <ReceiptRow title={'Tip'} cost={tip} />
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
      setPaymentMethod,
      setTip,
      submitOrder
    }
  )(Checkout);
