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
// import { BlurView } from 'react-native-blur';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
// import call from 'react-native-phone-call';
import { emptyBasket, onCompleteAuth } from '../../actions';
import {
  ModalPanel
} from '../_reusable';

import {
  BlockButton,
  CloseButton,
  ItemRow,
  AyezText
} from '../_common';

import {
  calculateTotal
} from '../../Helpers.js';

import {
  strings,
  translate
} from '../../i18n.js';

const window = Dimensions.get('window');
const skeuomorphBasket = require('../../../assets/images/skeuomorph_basket.png');
const closeCartCross = require('../../../assets/images_v2/close_cart.png');
const emptyBasketIcon = require('../../../assets/images_v2/empty_basket.png');
const clearBasket = require('../../../assets/images_v2/clear_basket.png');
import colors from '../../theme/colors';
import { destinations } from './destinations';
import { DestinationItem } from './_components/DestinationItem';
import styles from './styles';

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
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onAndroidBackPress
    );
  }

  onAndroidBackPress = () => {
    Actions.pop(); // Android back press
    return true;
  };

  renderCouponButton() {
    const { coupon } = this.props;

    if (coupon) {
      return (
        <TouchableOpacity
          onPress={() => Actions.couponModal()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            paddingRight: 15
          }}
          >
          <AyezText regular color={'#353333'}>{`Discount: ${coupon.amount} EGP`}</AyezText>
          <AyezText
            regular
            color={'#d33b2d'}
            size={11}
            style={{ marginLeft: 5 }}
            >{`“${coupon.code}”`}</AyezText>
            <AyezText
              regular
              color={'#0094ff'}
              style={{ marginLeft: 10 }}
              >Edit</AyezText>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => Actions.couponModal()}
        style={{
          position: 'absolute',
          top: 34,
          right: 12,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 4,
          backgroundColor: '#0094ff'
        }}
        >
        <AyezText semibold size={13} color={'white'}>{`+ Add Coupon`}</AyezText>
      </TouchableOpacity>
    );
  }

  renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.basketContatiner}>
          <Image
            source={skeuomorphBasket}
            style={{
              width: 300,
              height: 50,
              position: 'absolute',
              bottom: 0
            }}
            resizeMode={'stretch'}
          />
        </View>

        <View style={styles.headerDetailsContainer}>
          {/* price */}
          <AyezText regular size={18}>
            {strings('WorkingBasket.total')}
          </AyezText>
          <AyezText medium size={18}>
            {`${this.props.total.toFixed(2)} EGP`}
          </AyezText>
          {this.renderCouponButton()}
        </View>
      </View>
    );
  }

  renderItem({ item }) {
    return <ItemRow item={item} mutableQuantity seller={this.props.seller} />;
  }

  renderTableFooter() {
    const clearButton =
      this.props.items_array.length === 0 ? null : (
        <TouchableOpacity
          style={styles.emptyBasket}
          onPress={() => this.setState({ clearBasketModal: true })}
        >
          <Text style={styles.clearOrderTextStyle}>
            {strings('WorkingBasket.clearOrder')}
          </Text>
        </TouchableOpacity>
      );

    return <View>{clearButton}</View>;
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
      return <ActivityIndicator />;
    }
    // ListHeaderComponent={this.renderDestination()}
    return (
      <FlatList
        data={this.props.items_array}
        renderItem={this.renderItem.bind(this)}
        style={styles.itemsList}
        ListFooterComponent={this.renderTableFooter()}
        ListEmptyComponent={
          <Text style={styles.emptyCartStyle}>
            {strings('WorkingBasket.nothingInBasket')}
          </Text>
        }
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  renderEmptyTable() {
    return (
      <View style={styles.emptyBasketContainer}>
        <Image source={emptyBasketIcon} style={{ width: 60, height: 60 }} />
        <Text style={styles.emptyBasketTitle}>
          {strings('WorkingBasket.yourCartisEmptyTitle')}
        </Text>
        <Text style={styles.emptyBasketSubtitle}>
          {strings('WorkingBasket.yourCartisEmptySubitle')}
        </Text>
      </View>
    );
  }

  onContinuePress() {
    const { seller, subtotal } = this.props;

    if (seller.minimum && subtotal < seller.minimum) {
      // below the minimum, so indicate in a popup
      this.setState({ belowMinimumModal: true });
    } else {
      // continue onwards
      Actions.timeslotSelect();
    }
  }

  renderDestination() {
    return (
      <View style={{ backgroundColor: 'white' }}>
        {destinations.map(
          ({
            id,
            destinationTypeLabel,
            destinationIcon,
            destinationName,
            destinationAddress,
            destinationAddressImage
          }) => (
            <DestinationItem
              key={id}
              isSelected={this.state.selectedDestinationId == id}
              onPress={() => {
                this.setState({ selectedDestinationId: id });
              }}
              destinationTypeLabel={destinationTypeLabel}
              destinationIcon={destinationIcon}
              destinationName={destinationName}
              destinationAddress={destinationAddress}
              destinationAddressImage={destinationAddressImage}
            />
          )
        )}
      </View>
    );
  }

  renderContinue() {
    if (!this.props.phone) {
      return (
        <View style={styles.submitButtonContainer}>
          <BlockButton
            color={'#0094ff'}
            onPress={() => {
              this.props.onCompleteAuth(() => Actions.popTo('workingBasket'))
              Actions.auth();
            }}
            text={'Login to continue'}
          />
        </View>
      );
    }
    return (
      <View style={styles.submitButtonContainer}>
        <BlockButton
          color={colors.greenBlue}
          onPress={this.onContinuePress.bind(this)}
          text={strings('WorkingBasket.continue')}
        />
      </View>
    );
  }

  render() {
    const { seller, bluredViewRef, emptyBasket } = this.props;
    const sellerName = translate(seller.display_name);

    // const background = (bluredViewRef ? (
    //   <BlurView
    //     viewRef={bluredViewRef}
    //     style={styles.blurView}
    //     blurRadius={4}
    //     blurAmount={10}
    //     blurType={'dark'}
    //   />
    // ) : (
    //   <View style={styles.opaqueBackground} />
    // );

    const background = <View style={styles.opaqueBackground} />

    return (
      <View style={styles.container}>
        {background}
        <View style={{ flex: 1 }}>
          {this.renderHeader()}
          {this.props.items_array.length == 0
            ? this.renderEmptyTable()
            : this.renderTable()}
          {this.renderContinue()}

          <ModalPanel
            onClose={() => this.setState({ clearBasketModal: false })}
            visible={this.state.clearBasketModal}
          >
            <View style={styles.clearBasketContainer}>
              <Image
                source={clearBasket}
                style={styles.clearBasketImage}
                resizeMode="contain"
              />
              <Text style={styles.clearBasketTitle}>
                {strings('WorkingBasket.clearOrderModalHeader')}
              </Text>
              <BlockButton
                style={{ width: 300, marginBottom: 10 }}
                color={'#fe6668'}
                text={strings('WorkingBasket.dontClearOrderModalButton')}
                onPress={() => {
                  this.setState({ clearBasketModal: false });
                }}
              />
              <BlockButton
                style={{ width: 300 }}
                color={colors.greenBlue}
                text={strings('WorkingBasket.clearOrderModalButton')}
                onPress={() => {
                  emptyBasket(seller.id);
                  this.setState({ clearBasketModal: false });
                }}
              />
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
            <AyezText medium style={{ textAlign: 'center', marginTop: 20 }}>
                min. {seller.minimum} EGP for {sellerName}
              </AyezText>

          </ModalPanel>
        </View>

        <CloseButton fixed />
      </View>
    );
  }
}

const mapStateToProps = ({ Baskets, Seller, Coupon, Customer }) => {
  const seller = Seller;
  const basket = Baskets.baskets[Seller.id];
  // this is for submitting to Checkout in componentDidMount only

  const { items_array, subtotal, basket_quantity } = basket;
  const { coupon } = Coupon;
  const { phone } = Customer;

  // still migrating this (contains delivery fee, and all checkout data)
  const Checkout = {};

  const total = calculateTotal(basket, Checkout, coupon);
  // const { coupon_discount } = orderData;

  return {
    items_array,
    subtotal,
    basket_quantity,
    coupon,
    seller,
    total,

    phone
  };

  // coupon_discount,
  // orderTotal: orderData.total.final,
  // originalOrderTotal: orderData.total.original,
  // containsUnpriced: orderData.is_variable,
  // basketQuantity: orderData.basket_quantity
};

export default connect(
  mapStateToProps,
  {
    emptyBasket,
    onCompleteAuth
  }
)(WorkingBasket);
