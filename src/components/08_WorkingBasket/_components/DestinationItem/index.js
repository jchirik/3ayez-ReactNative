import React from 'react';
import { Text, Image, View, TouchableOpacity } from 'react-native';
import { RadioButtonInput } from 'react-native-simple-radio-button';
import colors from '../../../../theme/colors';
import styles from './styles';
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
        <Text style={styles.destinationTypeTitle}>{destinationTypeLabel}</Text>
        <Image
          style={styles.destinationTypeImage}
          source={destinationIcon}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.destinationName}>{destinationName}</Text>
      <Text style={styles.destinationAddress}>{destinationAddress}</Text>
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
