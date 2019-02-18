import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  Modal,
  Image,
  Platform,
  Animated,
  Easing
} from 'react-native';
import {
  paymentIcon,
  AYEZ_GREEN
} from '../../Helpers.js';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  BlockButton,
  AyezText
} from '../_common';

import {
  setPaymentMethod
} from '../../actions';

import {
  strings,
  translate
} from '../../i18n.js';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
// when isvisible set to true,  set the modal's visiblity, then initiate upward animation over the scene,
// when isvisible set to false, initiate reverse animation, then set the modal's visiblity

// NO animation for now

// INPUT FORMAT: {
//   isVisible:
//   backgroundColor:
//   title:
//   buttons: [{ text, action, buttonColor, textColor }]
// }


// ** NOTE **
// onClose says what we do WHENEVER the selection closes
// action for each button should NOT duplicate this action

class CreditCardSelection extends Component {

  constructor(props) {
    super(props);

    this.state = {
      animationTrack: new Animated.Value(0),
      modalHeight: 1000,
      unclickable: false
    };
  }

  onClose() {
    this.setState({ unclickable: true });
    // closing animation
    Animated.timing(
      this.state.animationTrack,
      {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }
    ).start(() => {
      // then trigger onClose from the parent
      this.props.onClose();
      this.setState({ unclickable: false });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.isVisible && !prevProps.isVisible) {
      this.setState({ unclickable: true });
      // enter animation
      Animated.timing(
        this.state.animationTrack,
        {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        }
      ).start(() => {
        this.setState({ unclickable: false });
      });
    }
  }


  render() {
    const {
      isVisible,
      credit_cards,
      backgroundColor = AYEZ_GREEN
    } = this.props;

    const animatePosition = (this.state.animationTrack.interpolate({
        inputRange: [ 0, 1 ],
        outputRange: [ this.state.modalHeight, 0 ]
      }));

    if (!isVisible) {
      return null;
    }

    const cardComponents = credit_cards.slice(0, 5).map(card => (
      <TouchableOpacity style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8
       }}
       onPress={() => {
         this.onClose();
         this.props.setPaymentMethod(card);
       }}
       >
        <Image
          source={paymentIcon(card.brand, 'CREDIT')}
          style={{
            width: 50,
            height: 50,
            marginLeft: 20,
            marginRight: 20
          }}
          resizeMode={'contain'}
        />
        <AyezText medium style={{
          fontSize: 14,
          color: 'white'
        }}>{card.brand} (**** {card.last4})</AyezText>
      </TouchableOpacity>
    ));

    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 1000
        }}
      >
        <AnimatedTouchableOpacity
          onPress={this.onClose.bind(this)}
          style={{
            opacity: this.state.animationTrack,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0
          }}
          disabled={this.state.unclickable}
          activeOpacity={1}
        />

        <Animated.View style={{
          backgroundColor,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 30,
          transform: [ { translateY: animatePosition } ]
          }}
          onLayout={(event) => {
            const {x, y, width, height} = event.nativeEvent.layout;
            this.setState({ modalHeight: height });
          }}
          >
          <AyezText bold style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 14,
            padding: 6,
            paddingRight: 10,
            paddingLeft: 10
          }}>{strings('CreditCardSelection.header')}</AyezText>

          { cardComponents }

          <BlockButton
            onPress={() => {
              this.onClose()
              Actions.creditCardCreate()
            }}
            text={strings('CreditCardSelection.addNewCard')}
            color={'#3B7A60'}
            style={{ marginTop: 10, marginBottom: 10 }}
            />
        </Animated.View>

      </View>
    );
  }
}

const mapStateToProps = ({ CreditCards }) => {
  const { credit_cards } = CreditCards;
  return { credit_cards };
};

export default connect(mapStateToProps, {
  setPaymentMethod
})(CreditCardSelection);
