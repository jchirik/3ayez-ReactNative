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
   AsyncStorage
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
    const { verification, confirmation_function, onComplete } = this.props;
    this.props.authPhoneVerify(verification, confirmation_function, onComplete);
  }

  renderSquare(digit) {
    return (
      <View style={{
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
      </View>
    )
  }

  renderVerificationInput() {
    const digits = this.props.verification.split('');
    const digitSquares = [];
    for (let i = 0; i < 6; i++) {
      digitSquares.push(this.renderSquare((i < digits.length) ? digits[i] : ''))
    }
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center'
      }}>
        <TextInput
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
        <Header title={'VERIFICATION CODE'}/>
        <View>
          <AyezText bold
            style={{
              fontSize: 14,
              marginTop: 22,
              marginLeft: 26,
              marginBottom: 10,
              alignSelf: 'flex-start'
            }}
          >Enter the code sent to you below</AyezText>

          { this.renderVerificationInput() }

          <AyezText light
            style={{
              fontSize: 12,
              textAlign: 'center',
              marginTop: 22,
              marginBottom: 10
            }}
          >Didn't receive code? Resend</AyezText>
          <BlockButton
            text={'CONFIRM'}
            style={{
              marginLeft: 18,
              marginRight: 18
            }}
            onPress={this.authPhoneVerify.bind(this)}
          />
          <LoadingOverlay isVisible={this.props.verification_loading} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ Auth }) => {
  const {
    verification,
    verification_loading,
    verification_error,
    confirmation_function,
    onComplete
  } = Auth;
  return {
    verification,
    verification_loading,
    verification_error,
    confirmation_function,
    onComplete
  };
};

export default connect(mapStateToProps, {
  authVerificationSet,
  authPhoneVerify
})(VerifyCode);
