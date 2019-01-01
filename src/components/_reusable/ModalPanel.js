import React from 'react';
import { Text, TouchableOpacity, View, Modal } from 'react-native';
import { BlockButton } from './BlockButton';

import {
  statusBarMargin
} from '../../Helpers.js';

const ModalPanel = ({
  visible,
  type,
  button1Text,
  button1Color,
  onButton1Press,
  button2Text,
  button2Color,
  onButton2Press,
  children,
  onClose = console.log('close')
}) => {

  let buttons = null;

  // layout bigButton (a big bottom blockbutton with optional underneath)
  if (type === 'bigButton') {
    const button1 = (
      <BlockButton
        style={{ marginBottom: 5 }}
        text={button1Text}
        color={button1Color}
        onPress={onButton1Press}
      />
    );
    let button2 = null;
    if (button2Text) {
      button2 = (
        <TouchableOpacity
          onPress={onButton2Press}
          style={styles.smallButtonContainer}
        >
          <Text style={[styles.smallButtonText, { color: button2Color || '#cecece' }]}>
            {button2Text}
          </Text>
        </TouchableOpacity>
      )
    }
    buttons = (
      <View style={{ margin: 10 }}>
        { button1 }
        { button2 }
      </View>
    );
  }

  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent
    >
      <View style={{ flex: 1 }}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.modalBackground}
        onPress={onClose}
      />
          <View style={styles.whitePanel}>
          {children}
          {buttons}
          </View>
        </View>
    </Modal>
  );
};

const styles = {
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute'
  },
  whitePanel: {
    alignSelf: 'center',
    position: 'absolute',
    top: statusBarMargin + 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  smallButtonContainer: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    padding: 2,
    paddingLeft: 9,
    paddingRight: 9
  },
  smallButtonText: {
    fontSize: 18
  }
};

export { ModalPanel };
