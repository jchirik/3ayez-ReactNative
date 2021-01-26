import React, { Component } from 'react';
import {
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Header, BlockButton, LoadingOverlay, AyezText } from '../../_common';
import {
  authVerificationSet,
  authPhoneVerify,
  robocallCode
} from '../../../actions';
import { strings } from '../../../i18n.js';
import colors from '../../../theme/colors';
import { isAndroid } from '../../../Helpers';
import { constants } from '../../../utils/contants';
import styles from './styles';

const timer = require('react-native-timer');

class VerifyCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timerSecond: 15
    };
  }

  initiateTimer() {
    timer.clearInterval(this);
    timer.setInterval(
      this,
      'hideMsg',
      () => {
        this.setState({ timerSecond: this.state.timerSecond - 1 });
        if (this.state.timerSecond <= 0) {
          timer.clearInterval(this);
        }
      },
      1000
    );
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
            if (isAndroid) {
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
        style={styles.digitSquare}
      >
        <AyezText semibold style={styles.digitText}>
          {digit}
        </AyezText>
      </TouchableOpacity>
    );
  }

  renderVerificationInput() {
    const digits = this.props.verification.split('');
    const digitSquares = [];
    for (let i = 0; i < constants.VERFICATION_CODE_LENGTH; i++) {
      digitSquares.push(
        this.renderSquare(i < digits.length ? digits[i] : '', i)
      );
    }
    return (
      <View style={styles.verificationCodeContainer}>
        <TextInput
          ref={input => {
            this.verificationInput = input;
          }}
          style={styles.verificationCodeText}
          value={this.props.verification}
          onChangeText={verification =>
            this.props.authVerificationSet(verification)
          }
          autoCorrect={false}
          keyboardType="phone-pad"
          autoCapitalize="none"
          selectTextOnFocus={false}
          caretHidden
          autoFocus
          maxLength={constants.VERFICATION_CODE_LENGTH}
        />
        {digitSquares}
      </View>
    );
  }

  renderRobocallButton() {
    if (this.state.timerSecond !== 0) {
      return (
        <AyezText
          medium
          color={colors.ayezGreen}
          style={styles.robocallWaitingText}
        >
          {strings('Authentication.robocallWaiting', {
            seconds: `${this.state.timerSecond}`
          })}
        </AyezText>
      );
    }

    if (this.props.robocall_loading) {
      return <ActivityIndicator size="small" style={styles.loadingIndicator} />;
    }
    return (
      <View style={styles.robocalButtonContainer}>
        <AyezText regular size={14} color={colors.grey}>
          {strings('Authentication.didntReceiveCode')}
        </AyezText>
        <TouchableOpacity
          style={styles.robocalButton}
          onPress={() => this.props.robocallCode(this.props.login_attempt_id)}
        >
          <AyezText medium size={14} color={colors.ayezGreen}>
            {strings('Authentication.callInstead')}
          </AyezText>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title={strings('Authentication.verificationHeader')} />
        <View>
          <AyezText bold style={styles.verificationInstructionText}>
            {strings('Authentication.verificationInstruction')}
          </AyezText>
          {this.renderVerificationInput()}
          <BlockButton
            deactivated={this.props.verification.length < constants.VERFICATION_CODE_LENGTH}
            text={strings('Common.confirm')}
            style={styles.confirmButton}
            onPress={this.authPhoneVerify.bind(this)}
          />
          {this.renderRobocallButton()}
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

export default connect(
  mapStateToProps,
  {
    authVerificationSet,
    authPhoneVerify,
    robocallCode
  }
)(VerifyCode);
