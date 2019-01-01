// KeyboardDismissableView
// an encompassing view that withdraws the keyboard when tapped

import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

const KeyboardDismissableView = ({ children, style }) => {
  return (
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}
        style={[{ flex: 1 }, style]}
      >
        {children}
      </TouchableWithoutFeedback>
  );
};

export { KeyboardDismissableView };
