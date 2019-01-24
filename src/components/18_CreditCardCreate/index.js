
import React, { Component } from 'react';
import firebase from 'react-native-firebase';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Platform,
  BackHandler
} from 'react-native';
import { CreditCardInput } from "react-native-credit-card-input";
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import {
  createStripeCard,
  createStripeCardReset
} from '../../actions';

import {
  strings
} from '../../Helpers.js';

import {
  Header,
  BlockButton,
  LoadingOverlay
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
        <Text style={{
          fontSize: 16,
          fontFamily: 'Poppins-Medium',
          color: 'red',
          textAlign: 'center',
          marginTop: 20
        }}>Error adding card</Text>
      )
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column' }}>
        <Header title={strings('AddCreditCard.header')} />
        <View style={{ height: 12 }} />
        <CreditCardInput
          labels={{
            number: strings('AddCreditCard.number'),
            expiry: strings('AddCreditCard.expiry'),
            cvc: strings('AddCreditCard.cvc'),
            name: strings('AddCreditCard.name')
          }}
          labelStyle={{ fontSize: 16, fontFamily: 'Poppins-Medium', fontWeight: 'normal', color: 'black' }}
          inputStyle={{ fontSize: 18, fontFamily: 'Poppins-Regular', color: 'black' }}
          onChange={this.onChange.bind(this)}
          requiresName
          autoFocus
        />
        {errorText}
        <BlockButton
          text={strings('AddCreditCard.submitCard')}
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
