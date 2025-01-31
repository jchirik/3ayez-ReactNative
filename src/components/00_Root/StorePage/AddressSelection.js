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
} from '../../../Helpers.js';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  BlockButton,
  AyezText,
  LoadingOverlay
} from '../../_common';

import {
  selectAddress
} from '../../../actions';

import {
  strings,
  translate
} from '../../../i18n.js';

import colors from '../../../theme/colors'
import images from '../../../theme/images'
import { sceneKeys, navigateTo } from '../../../router';

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

class AddressSelection extends Component {

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
      addresses,
      backgroundColor = AYEZ_GREEN
    } = this.props;

    const animatePosition = (this.state.animationTrack.interpolate({
        inputRange: [ 0, 1 ],
        outputRange: [ this.state.modalHeight, 0 ]
      }));

    if (!isVisible) {
      return null;
    }

    const addressComponents = addresses.slice(0, 3).map(address => {
      let addressHeader = address.street;
      let addressDetails = strings('Address.detail', { building: address.building, apt: address.apt });

      if (!address.street) {
        addressHeader = address.title;
        addressDetails = '';
      }
      return (
        <TouchableOpacity
          key={address.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 8,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.25)',
            paddingHorizontal: 20
           }}
         onPress={() => {
           this.props.selectAddress(address, this.onClose.bind(this));
         }}
         >
          <View style={{ flex: 1, alignItems: 'flex-start' }}>
            <AyezText bold style={{
              color: 'white'
            }}>{addressHeader}</AyezText>
            <AyezText medium style={{
              color: 'white'
            }}>{addressDetails}</AyezText>
          </View>

          <Image
            source={(address.id === this.props.address.id) ? images.toggleSelected : images.toggleUnselected}
            style={{
              width: 24,
              height: 24,
              marginLeft: 20,
              tintColor: 'white'
            }}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      )
    });

    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 1000,
          zIndex: 10
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
            marginTop: 6,
            marginBottom: 8
          }}>{strings('AddressSelection.header')}</AyezText>


          <TouchableOpacity style={{
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            top: 16, right: 16,
            padding: 10,
           }}
           onPress={() => {
              this.onClose();
              navigateTo(sceneKeys.addressManager);
           }}
           >
            <AyezText medium style={{
              fontSize: 14,
              color: 'white'
            }}>{strings('Common.edit')}</AyezText>
          </TouchableOpacity>


          { addressComponents }

          <BlockButton
            onPress={() => {
              this.onClose()
              navigateTo(sceneKeys.addressCreate)
            }}
            text={strings('AddressSelection.anotherLocation')}
            color={colors.ayezSubGreen}
            style={{ marginTop: 14, marginBottom: 0 }}
            />
        </Animated.View>

        <LoadingOverlay isVisible={this.props.is_loading} />
      </View>
    );
  }
}

const mapStateToProps = ({ Addresses, AddressSelect }) => {
  const { addresses, address } = Addresses;
  const { is_loading, error } = AddressSelect;
  return {
    addresses,
    address,

    is_loading,
    error
  };
};

export default connect(mapStateToProps, {
  selectAddress
})(AddressSelection);
