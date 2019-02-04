import React from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import { RadioButtonInput } from 'react-native-simple-radio-button';
import colors from '../../../../theme/colors';
import styles from './styles';
import {
  AyezText
} from '../../../_common';

const DestinationItem = ({
  isSelected,
  destinationTypeLabel,
  destinationIcon,
  destinationName,
  destinationAddress,
  destinationAddressImage,
  onPress
}) => (
  <TouchableOpacity
    style={[
      styles.container,
      { backgroundColor: isSelected ? colors.paleGrey : colors.white }
    ]}
    onPress={onPress}
  >
    <View style={styles.detailContainer}>
      <View style={styles.destinationTypeContainer}>
        <AyezText regular style={styles.destinationTypeTitle}>{destinationTypeLabel}</AyezText>
        <Image
          style={styles.destinationTypeImage}
          source={destinationIcon}
          resizeMode="contain"
        />
      </View>
      <AyezText regular style={styles.destinationName}>{destinationName}</AyezText>
      <AyezText regular style={styles.destinationAddress}>{destinationAddress}</AyezText>
    </View>
    <Image
      source={destinationAddressImage}
      style={styles.destinationAddressImage}
      resizeMode="contain"
    />
    <RadioButtonInput
      obj={{}}
      isSelected={isSelected}
      onPress={onPress}
      buttonColor={isSelected ? colors.greenBlue : colors.steel}
      borderWidth={1}
      buttonSize={13}
      buttonOuterSize={17}
    />
  </TouchableOpacity>
);

export { DestinationItem };
