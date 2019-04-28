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
  authPhoneVerify,
  robocallCode
} from '../../../actions';

import {
  strings,
  translate
} from '../../../i18n.js';

import colors from '../../../theme/colors';

const timer = require('react-native-timer');

class VerifyCode extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timerSecond: 15,
    };
  }

  initiateTimer() {
    timer.clearInterval(this);
    timer.setInterval(this, 'hideMsg', () => {
      this.setState({ timerSecond: this.state.timerSecond - 1 });
      if (this.state.timerSecond <= 0) {
        timer.clearInterval(this);
      }
    }, 1000);
  }

  componentDidMount() {
    this.setState({ timerSecond: 15 });
    this.initiateTimer();
  }

  componentDidUpdate(prevProps) {
    if (!this.props.robocall_loading && prevProps.robocall_loading) {
      this.setState({ timerSecond: 10 });
      this.initiateTimer();
    }
  }

  authPhoneVerify() {
    console.log('verify');
    const { verification, login_attempt_id } = this.props;
    this.props.authPhoneVerify(verification, login_attempt_id);
  }

  renderSquare(digit, index) {
    return (
      <TouchableOpacity
      key={`${index}`}
      onPress={() => {
        if (this.verificationInput) {
          if (Platform.OS === "android") {
            this.verificationInput.blur();
            setTimeout(() => {
              this.verificationInput.focus();
            }, 100);
          } else {
            this.verificationInput.focus();
          }
        }
      }}
      activeOpacity={1}
      style={{
        height: 64,
        width: 46,
        margin: 12,
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
          fontSize: 26
        }}>{digit}</AyezText>
      </TouchableOpacity>
    )
  }

  renderVerificationInput() {
    const digits = this.props.verification.split('');
    const digitSquares = [];
    for (let i = 0; i < 4; i++) {
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


  renderRobocallButton() {
    if (this.state.timerSecond !== 0) {
      return (
        <AyezText medium color={colors.ayezGreen}
          style={{ alignSelf: 'center' }}>{strings('Authentication.robocallWaiting', { seconds: `${this.state.timerSecond}` })}</AyezText>
      )
    }

    if (this.props.robocall_loading) {
      return (
        <ActivityIndicator size="small" style={{ padding: 20, alignSelf: 'center' }} />
      )
    }
    return (
      <View style={{ alignItems: 'center' }}>
        <AyezText regular size={14} color={"#888888"}>{strings('Authentication.didntReceiveCode')}</AyezText>

        <TouchableOpacity
          style={{ padding: 10 }}
          onPress={() => this.props.robocallCode(this.props.login_attempt_id)}
          >
          <AyezText medium size={14} color={colors.ayezGreen}>{strings('Authentication.callInstead')}</AyezText>
        </TouchableOpacity>
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
            deactivated={this.props.verification.length < 4}
            text={strings('Common.confirm')}
            style={{
              marginTop: 32,
              marginLeft: 18,
              marginRight: 18
            }}
            onPress={this.authPhoneVerify.bind(this)}
          />
          <View style={{ height: 30 }} />
          { this.renderRobocallButton() }
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
    login_attempt_id,

    robocall_loading
  } = Auth;
  return {
    verification,
    verification_loading,
    verification_error,
    login_attempt_id,
    robocall_loading
  };
};

export default connect(mapStateToProps, {
  authVerificationSet,
  authPhoneVerify,
  robocallCode
})(VerifyCode);
