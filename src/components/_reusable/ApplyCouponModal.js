import _ from 'lodash';
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  FlatList,
  Dimensions,
  Modal
} from 'react-native';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
  toggleCouponModal,
  applyCoupon,
  resetCoupon
} from '../../actions';

import { strings, parseCouponError } from '../../Helpers.js';

import { ModalPanel } from './ModalPanel';
import { BlockButton } from './BlockButton';

const window = Dimensions.get('window');


const couponModalHeader = require('../../../assets/images/coupon_modal_header.png');
const coinsFalling = require('../../../assets/images/coins_falling.png');
const closeIcon = require('../../../assets/images/close_x.png');

function coupon_text(coupon) {
  let dealText = '';
  if (coupon.type === 'percent_discount') {
    dealText=`${coupon.amount*100} ${strings('CouponModal.percentOff')}`;
  } else if (coupon.type === 'pound_discount') {
    dealText=`${coupon.amount} ${strings('CouponModal.poundsOff')}`;
  }
  return dealText;
}

class ApplyCouponModal extends Component {

  constructor(props) {
    super(props);
    this.state = { couponCode: '', modalWidth: 0 };
  }

  applyCoupon() {
    this.props.applyCoupon(this.state.couponCode, this.props.seller.id);
  }

  // coupon modal shown is a GLOBAL variables


  renderSuccessScreen() {

    let subtitleText2 = '';
    if (this.props.coupon.minimum) {
      subtitleText2 = `${strings('CouponModal.minimum')} ${this.props.coupon.minimum}ج`;
    }

    return (
      <View>
        <Text style={styles.codeEntryTitle}>{strings('CouponModal.successHeader')}</Text>
        <Text style={styles.codeEntrySubtitle}>{coupon_text(this.props.coupon)}</Text>
        { (subtitleText2) ? (
          <Text style={styles.codeEntrySubtitle}>{subtitleText2}</Text>
        ) : null }

        <BlockButton
          text={strings('CouponModal.removeCoupon')}
          style={{marginTop: 16, marginLeft: 20, marginRight: 20 }}
          color={'#F05C64'}
          onPress={() => this.props.resetCoupon(this.props.seller.id)} />

        <BlockButton
          text={strings('CouponModal.ok')}
          style={{marginTop: 10, marginLeft: 20, marginRight: 20, marginBottom: 20}}
          color={'#0094ff'}
          onPress={() => this.props.toggleCouponModal()} />

      </View>
    );
  }

  renderCouponInputButton() {

    if (this.props.isLoading) {
      return (<ActivityIndicator size="large" style={{marginTop: 5, marginBottom: 20, height: 44}}/>);
    }
    // if INVALID coupon check

    return (
      <View>
      {(this.props.isFail) ? (
        <Text style={{ fontSize: 17, textAlign: 'center', color: 'red', fontFamily: 'BahijJanna'}}>{parseCouponError(this.props.error)}</Text>
      ) : null}
      <BlockButton
        text={<Text>{strings('CouponModal.submitCouponButton')}</Text>}
        style={{marginLeft: 20, marginRight: 20, marginTop: 5, marginBottom: 20}}
        color={'#F05C64'}
        onPress={this.applyCoupon.bind(this)} />
      </View>
    )
  }


  renderCouponInputScreen() {

    let isSmallScreen = false;
    if (window.height <= 580) { isSmallScreen = true; }

    return (
        <View
          style={{ flexDirection: 'column' }}
          onLayout={(event) => this.setState({ modalWidth: event.nativeEvent.layout.width })}
          >

          <Image
            source={coinsFalling}
            style={{ position: 'absolute', left: 0, right: 0, width: this.state.modalWidth, height: 100 }}
            resizeMode={'cover'}
          />

          <View>
              <Text style={styles.codeEntryTitle}>{strings('CouponModal.header')}</Text>
            </View>

          <Image
            source={couponModalHeader}
            style={{  height: isSmallScreen ? 50 : 100,  alignSelf: 'center' }}
            resizeMode={'contain'}
          />
          <TextInput
          style={styles.inputStyle}
          value={this.state.couponCode}
          onChangeText={(couponCode) => this.setState({ couponCode })}
          autoCapitalize={'none'}
          underlineColorAndroid='transparent'
          autoFocus
          blurOnSubmit={false}
          />
          {this.renderCouponInputButton()}
        </View>
    );
  }


  render() {
    return (
      <ModalPanel
        visible={this.props.isVisible}
        onClose={() => this.props.toggleCouponModal()}
      >
        { (this.props.coupon) ? this.renderSuccessScreen() : this.renderCouponInputScreen() }

        <TouchableOpacity
          style={{ position: 'absolute', top: 10, right: 10}}
          onPress={() => this.props.toggleCouponModal()}
          >
          <Image
            style={{ width: 22, height: 22, margin: 5 }}
            source={closeIcon}
          />
        </TouchableOpacity>
      </ModalPanel>
    );
  }
}


const styles = {
  shadowPanelStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20
  },
  headerTextStyle: {
    color: '#fff',
    fontSize: 20,
    backgroundColor: 'transparent',
    fontFamily: 'BahijJanna-Bold',
    textAlign: 'center'
  },
  pointsTextStyle: {
    color: '#fff',
    fontSize: 50,
    backgroundColor: 'transparent',
    fontFamily: 'BahijJanna-Bold',
    textAlign: 'center'
  },
  inputStyle: {
    color: '#000',
    padding: 5,
    margin: 40,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    lineHeight: 30,
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#cecece',
    backgroundColor: 'white',
    fontFamily: 'BahijJanna',
    textAlign: 'right'
  },
  notesTitleStyle: {
    marginLeft: 50,
    marginRight: 50,
    fontSize: 16,
    fontFamily: 'BahijJanna',
  },
  notesTextStyle: {
    marginLeft: 45,
    marginRight: 45,
    marginTop: 8,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#c5c5c5',
    backgroundColor: '#fbfbfb',
    fontSize: 16,
    fontFamily: 'BahijJanna',
    padding: 12,
    textAlign: 'right',
    textAlignVertical: 'top'
  },
  mainContainerStyle: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#8b25e8'
  },

  codeEntryTitle: {
    marginTop: 16,
    marginBottom: 6,
    textAlign: 'center',
    color: '#000',
    fontFamily: 'BahijJanna-Bold',
    fontSize: 22
  },
  codeEntrySubtitle: {
    textAlign: 'center',
    color: '#000',
    fontFamily: 'BahijJanna',
    fontSize: 15,
    marginLeft: 20,
    marginRight: 20
  },
};


const mapStateToProps = ({ CurrentSeller, WorkingOrders, CouponModal }) => {

  const seller = CurrentSeller;
  const { baskets } = WorkingOrders;
  const { coupon } = baskets[seller.id];

  const { isLoading, isVisible, isFail, error } = CouponModal;
  return { seller, coupon, isLoading, isVisible, isFail, error };
};

export default connect(mapStateToProps,
  { toggleCouponModal, applyCoupon, resetCoupon }
)(ApplyCouponModal);
