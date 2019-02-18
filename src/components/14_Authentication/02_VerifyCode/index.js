import React, { Component } from 'react';
import {
  View,
  TextInput,
  FlatList,
   Image,
   ActivityIndicator,
   TouchableOpacity,
   SectionList,
   Platform,
   BackHandler,
   AsyncStorage,
   I18nManager
 } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  Header,
  BlockButton,
  LoadingOverlay,
  AyezText
} from '../../_common';
// import { Circle } from 'react-native-progress';
// import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import {
  authVerificationSet,
  authPhoneVerify
} from '../../../actions';

import {
  strings,
  translate
} from '../../../i18n.js';

class VerifyCode extends Component {

  constructor(props) {
    super(props);
  }

  authPhoneVerify() {
    console.log('verify');
    const { verification, confirmation_function } = this.props;
    this.props.authPhoneVerify(verification, confirmation_function);
  }

  renderSquare(digit, index) {
    return (
      <TouchableOpacity
      key={`${index}`}
      onPress={() => {
        if (this.verificationInput) {
          this.verificationInput.focus();
        }
      }}
      activeOpacity={1}
      style={{
        height: 50,
        width: 38,
        margin: 6,
        backgroundColor: 'white',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: -1, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
      }}>
        <AyezText semibold style={{
          fontSize: 24
        }}>{digit}</AyezText>
      </TouchableOpacity>
    )
  }

  renderVerificationInput() {
    const digits = this.props.verification.split('');
    const digitSquares = [];
    for (let i = 0; i < 6; i++) {
      digitSquares.push(this.renderSquare((i < digits.length) ? digits[i] : '', i))
    }
    return (
      <View style={{
        flexDirection: (I18nManager.isRTL ? 'row-reverse' : 'row'),
        justifyContent: 'center'
      }}>
        <TextInput
          ref={(input) => { this.verificationInput = input; }}
          style={{
            position: 'absolute', color: 'transparent', opacity: 0,
            backgroundColor: 'transparent',fontSize: 1 }}
          value={this.props.verification}
          onChangeText={(verification) => this.props.authVerificationSet(verification)}
          autoCorrect={false}
          keyboardType='numeric'
          autoCapitalize = 'none'
          selectTextOnFocus={false}
          caretHidden
          autoFocus
        />
        {digitSquares}
      </View>
    )
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header title={strings('Authentication.verificationHeader')}/>
        <View>
          <AyezText bold
            style={{
              fontSize: 14,
              marginTop: 22,
              marginLeft: 26,
              marginBottom: 10,
              alignSelf: 'flex-start'
            }}
          >{strings('Authentication.verificationInstruction')}</AyezText>

          { this.renderVerificationInput() }

          {/*
            <AyezText light
            style={{
              fontSize: 12,
              textAlign: 'center',
              marginTop: 22,
              marginBottom: 10
            }}
          >{strings('Authentication.resend')}</AyezText>
          */}
          <BlockButton
            deactivated={this.props.verification.length < 6}
            text={strings('Common.confirm')}
            style={{
              marginTop: 32,
              marginLeft: 18,
              marginRight: 18
            }}
            onPress={this.authPhoneVerify.bind(this)}
          />
        </View>
        <LoadingOverlay isVisible={this.props.verification_loading} />
      </View>
    );
  }
}

const mapStateToProps = ({ Auth }) => {
  const {
    verification,
    verification_loading,
    verification_error,
    confirmation_function
  } = Auth;
  return {
    verification,
    verification_loading,
    verification_error,
    confirmation_function
  };
};

export default connect(mapStateToProps, {
  authVerificationSet,
  authPhoneVerify
})(VerifyCode);
