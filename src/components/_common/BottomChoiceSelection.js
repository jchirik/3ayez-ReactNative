import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
  Platform,
  Animated,
  Easing
} from 'react-native';
import {
  AYEZ_GREEN
} from '../../Helpers.js';
import { BlockButton } from './BlockButton';

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

class BottomChoiceSelection extends Component {

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
      backgroundColor = AYEZ_GREEN,
      title,
      buttons = []
    } = this.props;

    const animatePosition = (this.state.animationTrack.interpolate({
        inputRange: [ 0, 1 ],
        outputRange: [ this.state.modalHeight, 0 ]
      }));


    const buttonComponents = buttons.map(({ text, action, buttonColor, textColor }) =>
      <BlockButton
        onPress={action}
        text={text.toUpperCase()}
        color={buttonColor || 'white'}
        style={{ marginTop: 10, marginBottom: 10 }}
        textStyle={{
          color: (textColor || backgroundColor),
          fontFamily: 'Poppins-Light'
        }}
        />
    )

    const unclickableOverlay = this.state.unclickable ? (
      <View style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
      }}/>
    ) : null;

    return (
      <Modal
        animationType="none"
        visible={isVisible}
        onDismiss={this.onClose.bind(this)}
        transparent
      >
        <AnimatedTouchableOpacity
          onPress={this.onClose.bind(this)}
          style={{
            opacity: this.state.animationTrack,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            flex: 1
          }}
          activeOpacity={1}
        />

        <Animated.View style={{
          backgroundColor,
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
          <Text style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 14,
            fontFamily: 'Poppins-Bold',
            padding: 6,
            paddingRight: 10,
            paddingLeft: 10
          }}>{title}</Text>
          {buttonComponents}
        </Animated.View>

        { unclickableOverlay }
      </Modal>
    );

  }
}

export default BottomChoiceSelection;
