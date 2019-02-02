import React from 'react';
import { TouchableOpacity, View, Modal } from 'react-native';
import { BlockButton } from '../../_common';
import styles from './styles';

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
        style={{ marginBottom: 12 }}
        text={button1Text}
        color={button1Color}
        onPress={onButton1Press}
      />
    );
    let button2 = null;
    if (button2Text) {
      button2 = (
        <BlockButton
          style={{ marginBottom: 12 }}
          text={button2Text}
          color={button2Color}
          onPress={onButton2Press}
        />
      );
    }
    buttons = (
      <View style={styles.buttonsContainer}>
        {button1}
        {button2}
      </View>
    );
  }

  return (
    <Modal animationType="fade" visible={visible} transparent>
      <View style={styles.container}>
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

export { ModalPanel };
