import React from 'react';
import { Image, I18nManager } from 'react-native';

const RTLImage = (props) => {
  let transform = [ { scaleX: I18nManager.isRTL ? -1 : 1 } ];
  if (style && style.transform) {
    style.transform.forEach((t) => transform.push(t));
  }
  return (
      <Image
        {...props}
        style={{
          ...props.style,
          transform
        }}
      />
  );
};
export { RTLImage };
