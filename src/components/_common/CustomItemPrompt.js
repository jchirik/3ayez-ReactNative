import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  STATUS_BAR_HEIGHT,
  AYEZ_GREEN
} from '../../Helpers.js';
import {
  AyezText
} from '.'
import {
  strings,
  translate
} from '../../i18n.js';


import images from '../../theme/images'

const CustomItemPrompt = () => {
  return (
    <TouchableOpacity style={{
      backgroundColor: '#f7f7f7',
      marginVertical: 10,
      marginHorizontal: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 8
    }}
    onPress={() => Actions.customProduct()}
    >
      <Image
        style={{
          width: 70,
          height: 70,
          marginRight: 10
        }}
        source={images.customProductIcon}
        resizeMode={'contain'}
        />
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <AyezText medium size={16}>{strings('StoreSearch.customItemPromptHeader')}</AyezText>
        <AyezText regular size={13} color={'#0094ff'}>{strings('StoreSearch.customerItemPromptDescription')}</AyezText>
      </View>
    </TouchableOpacity>
  );
};

export { CustomItemPrompt };
