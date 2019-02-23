import React from 'react';
import { Image, TouchableWithoutFeedback, View } from 'react-native';

import images from '../../theme/images'

const StarRating = ({
  value,
  onChange,
  containerStyle,
  color='#FFDD00'
}) => {

  const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <TouchableWithoutFeedback
          onPress={() => onChange({ value: i + 1 })}
        >
          <Image
            style={{
              width: 36,
              height: 36,
              margin: 5,
              tintColor: (i < value) ? color : '#E5E5E5'
            }}
            resizeMode={'contain'}
            source={images.starIcon}
          />
        </TouchableWithoutFeedback>
      );
    }
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      ...containerStyle
    }}>
      {stars}
    </View>
  );
};

export { StarRating };
