import React from 'react';
import {
  TouchableOpacity,
  View,
  Modal,
  Image
} from 'react-native';
import {
  AyezText,
  BlockButton
} from '../../_common';

import {
  strings,
  translate,
  FONT_MEDIUM
} from '../../../i18n.js';

const StorePopup = ({
  visible,
  onClose = console.log('close'),
  popup
}) => {

  if (!popup) { return null; }

  const {
    image_url,
    description
  } = popup;

  // let buttons = null;
  //
  // if (category_link) {
  //   const button1 = (
  //     <BlockButton
  //       style={{ marginBottom: 12 }}
  //       text={button1Text}
  //       color={button1Color}
  //       onPress={onButton1Press}
  //     />
  //   );
  //   let button2 = null;
  //   if (button2Text) {
  //     button2 = (
  //       <BlockButton
  //         style={{ marginBottom: 12 }}
  //         text={button2Text}
  //         color={button2Color}
  //         onPress={onButton2Press}
  //       />
  //     );
  //   }
  //   buttons = (
  //     <View style={styles.buttonsContainer}>
  //       {button1}
  //       {button2}
  //     </View>
  //   );
  // }

  return (
    <Modal animationType="fade" visible={visible} transparent>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackground}
          onPress={onClose}
        />
        <View style={styles.whitePanel}>
          <Image
            resizeMode={'contain'}
            source={{
              uri: image_url
            }}
            style={{
              backgroundColor: '#f7f7f7',
              width: 260,
              height: 130
            }} />
          <AyezText regular size={14} style={{
            marginHorizontal: 24,
            marginTop: 12,
            marginBottom: 20
          }}>
            {translate(description)}
          </AyezText>
          <BlockButton
            style={{
              marginHorizontal: 30,
              alignSelf: 'stretch'
             }}
            text={strings('Common.OK')}
            onPress={() => onClose()}
          />
        </View>
      </View>
    </Modal>
  );
};



const styles = {
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 12,
    width: 300
  }
}

export { StorePopup };
