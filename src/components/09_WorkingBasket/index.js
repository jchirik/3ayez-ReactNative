import React, { Component } from 'react';
import {
  View,
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
 import firebase from 'react-native-firebase';
 import { AppEventsLogger } from 'react-native-fbsdk';
// import call from 'react-native-phone-call';
import { emptyBasket, onCompleteAuth } from '../../actions';

import {
  ModalPanel,
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
  translate,
  formatCurrency
} from '../../i18n.js';

const window = Dimensions.get('window');

import images from '../../theme/images'

import colors from '../../theme/colors';
import { DestinationItem } from './_components/DestinationItem';
import styles from './styles';
import { sceneKeys, navigateBackTo } from '../../router';

class WorkingBasket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clearBasketModal: false,
      belowMinimumModal: false
    };
  }

  componentDidMount() {
    try {
      firebase.analytics().logEvent("OPENED_BASKET");
      AppEventsLogger.logEvent('OPENED_BASKET');
    } catch (e) {
      console.log('AppEventsLogger error', e)
    }
  }

  renderCouponButton() {
    const { coupon } = this.props;

    if (coupon) {
      return (
        <TouchableOpacity
          onPress={() => {
            if(sceneKeys.couponModal != Actions.currentScene) {
              Actions.couponModal()
            }
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            paddingRight: 15
          }}
          >
          <AyezText regular color={'#353333'}>{strings('WorkingBasket.couponDiscount', { amount: coupon.amount })}</AyezText>
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
              >{strings('Common.edit')}</AyezText>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => {
          if(sceneKeys.couponModal != Actions.currentScene) {
            Actions.couponModal()
          }
        }}
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
        <AyezText semibold size={13} color={'white'}>{strings('WorkingBasket.addCoupon')}</AyezText>
      </TouchableOpacity>
    );
  }

  renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <View style={{
          ...styles.basketContainer,
          backgroundColor: this.props.seller.color
          }}>
          {/*<Image
            source={{ uri: this.props.seller.cover_url }}
            style={{
              opacity: 0.5,
              width: '100%',
              height: '100%'
            }}
            resizeMode={'cover'}
          />*/}
          <Image
            source={images.skeuomorphBasket}
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
            {strings('Receipt.subtotal')}
          </AyezText>
          <AyezText medium size={18}>
            {formatCurrency(this.props.total)}
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
          <AyezText regular style={styles.clearOrderTextStyle}>
            {strings('WorkingBasket.clearOrder')}
          </AyezText>
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

    let items = this.props.items_array
    // sort items_array s.t. custom items are at the end
    items = items.sort((x, y) => {
        return (x.is_custom === y.is_custom)? 0 : x.is_custom ? 1 : -1;
    });

    return (
      <FlatList
        data={items}
        renderItem={this.renderItem.bind(this)}
        style={styles.itemsList}
        ListFooterComponent={this.renderTableFooter()}
        ListEmptyComponent={
          <AyezText regular style={styles.emptyCartStyle}>
            {strings('WorkingBasket.nothingInBasket')}
          </AyezText>
        }
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  renderEmptyTable() {
    return (
      <View style={styles.emptyBasketContainer}>
        <Image source={images.emptyBasketIcon} style={{ width: 60, height: 60 }} />
        <AyezText regular style={styles.emptyBasketTitle}>
          {strings('WorkingBasket.emptyCartTitle')}
        </AyezText>
        <AyezText regular style={styles.emptyBasketSubtitle}>
          {strings('WorkingBasket.emptyCartSubtitle')}
        </AyezText>
      </View>
    );
  }

  onContinuePress() {
    const { seller, subtotal } = this.props;

    if (seller.minimum && subtotal < seller.minimum) {
      // below the minimum, so indicate in a popup
      this.setState({ belowMinimumModal: true });
    } else {
      if (seller.type === 'HYPER') {
        // continue onwards
        if(sceneKeys.timeslotSelect != Actions.currentScene) {
          Actions.timeslotSelect();
        }
      } else {
        if(sceneKeys.yallaTimeSelect != Actions.currentScene) {
          Actions.yallaTimeSelect();
        }
      }
    }
  }

  // renderDestination() {
  //   return (
  //     <View style={{ backgroundColor: 'white' }}>
  //       {[].map(
  //         ({
  //           id,
  //           destinationTypeLabel,
  //           destinationIcon,
  //           destinationName,
  //           destinationAddress,
  //           destinationAddressImage
  //         }) => (
  //           <DestinationItem
  //             key={id}
  //             isSelected={this.state.selectedDestinationId == id}
  //             onPress={() => {
  //               this.setState({ selectedDestinationId: id });
  //             }}
  //             destinationTypeLabel={destinationTypeLabel}
  //             destinationIcon={destinationIcon}
  //             destinationName={destinationName}
  //             destinationAddress={destinationAddress}
  //             destinationAddressImage={destinationAddressImage}
  //           />
  //         )
  //       )}
  //     </View>
  //   );
  // }

  renderContinue() {
    if (!this.props.phone) {
      return (
        <View style={styles.submitButtonContainer}>
          <BlockButton
            color={'#0094ff'}
            onPress={() => {
              if(sceneKeys.auth != Actions.currentScene) {
                this.props.onCompleteAuth(() => navigateBackTo(sceneKeys.workingBasket))
                Actions.auth();
              }
            }}
            text={strings('WorkingBasket.loginToContinue')}
          />
        </View>
      );
    }
    return (
      <View style={styles.submitButtonContainer}>
        <BlockButton
          onPress={this.onContinuePress.bind(this)}
          text={strings('Common.continue')}
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
                source={images.clearBasketImage}
                style={styles.clearBasketImage}
                resizeMode="contain"
              />
              <AyezText regular multiline style={styles.clearBasketTitle}>
                {strings('WorkingBasket.clearBasketModalHeader')}
              </AyezText>
              <BlockButton
                style={{ width: 300, marginBottom: 10 }}
                color={'#fe6668'}
                text={strings('WorkingBasket.clearBasketModalCancel')}
                onPress={() => {
                  this.setState({ clearBasketModal: false });
                }}
              />
              <BlockButton
                style={{ width: 300 }}
                color={colors.greenBlue}
                text={strings('WorkingBasket.clearBasketModalConfirm')}
                onPress={() => {
                  emptyBasket(seller.id);
                  this.setState({ clearBasketModal: false });
                }}
              />
            </View>
          </ModalPanel>

          <ModalPanel
            type={'bigButton'}
            button1Text={strings('Common.OK')}
            onButton1Press={() => {
              this.setState({ belowMinimumModal: false });
            }}
            onClose={() => this.setState({ belowMinimumModal: false })}
            visible={this.state.belowMinimumModal}
          >
            <AyezText medium style={{ textAlign: 'center', marginTop: 24 }}>
                {strings('WorkingBasket.minimumOrderModal', { min: formatCurrency(seller.minimum), seller_name: sellerName })}
              </AyezText>

          </ModalPanel>
        </View>

        <CloseButton fixed />
      </View>
    );
  }
}

// Your balance of 23.44 can be used on this order at checkout

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
