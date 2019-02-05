
import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Platform,
  BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';


import { CreditCardInput } from './RTL-credit-card-input';

import {
  createStripeCard,
  createStripeCardReset
} from '../../actions';

import {
  strings,
  translate,
  FONT_REGULAR,
  FONT_MEDIUM
} from '../../i18n.js';

import {
  Header,
  BlockButton,
  LoadingOverlay,
  AyezText
} from '../_common';

class CreditCardCreate extends Component {
// once card is added, show LOADING until card_processing file returns tru
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      number: '',
      expiry: '',
      cvc: '',
      is_valid: false
    };
  }

  componentDidMount() {
    this.props.createStripeCardReset()
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  onAndroidBackPress = () => {
    Actions.pop(); // Android back press
    return true;
  }

  onChange({ status, values }) {

    console.log(status)
    console.log(values)
    const { name, number, expiry, cvc, type } = values;

    let is_valid = true;
    Object.keys(status).forEach((key) => {
      if (status[key] !== 'valid') { is_valid = false; }
    });

    this.setState({
      name,
      number,
      expiry,
      cvc,
      type,
      is_valid
    });
  }

  onComplete() {
    this.props.createStripeCard(this.state);
  }

  render() {

    if (this.props.isLoading) {
      return <ActivityIndicator size="small" />;
    }

    let errorText = null;
    if (this.props.error) {
      errorText = (
        <AyezText medium style={{
          fontSize: 16,
          color: 'red',
          textAlign: 'center',
          marginTop: 20
        }}>{strings('CreditCard.errorAddingCard')}</AyezText>
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column' }}>
        <Header title={strings('CreditCard.addCard')} />
        <View style={{ height: 12 }} />
        <CreditCardInput
          labels={{
            number: strings('CreditCard.number'),
            expiry: strings('CreditCard.expiry'),
            cvc: strings('CreditCard.cvc'),
            name: strings('CreditCard.name')
          }}
          labelStyle={{ fontSize: 13, fontFamily: FONT_MEDIUM(), color: 'black' }}
          inputStyle={{ fontSize: 15, fontFamily: FONT_REGULAR(), color: 'black' }}
          onChange={this.onChange.bind(this)}
          requiresName
          allowScroll
          autoFocus
        />
        {errorText}
        <BlockButton
          text={strings('Common.submit')}
          style={{ margin: 20 }}
          deactivated={!this.state.is_valid}
          onPress={this.onComplete.bind(this)}
          color='#41D567'
        />
        <LoadingOverlay
          isVisible={this.props.is_loading}
        />
      </View>
    );
  }
}


const mapStateToProps = ({ CreditCardCreate }) => {
  const {
    success,
    is_loading,
    error
  } = CreditCardCreate;

  return {
    success,
    is_loading,
    error
   };
 }

export default connect(mapStateToProps,
  {
    createStripeCard,
    createStripeCardReset
  }
)(CreditCardCreate);
