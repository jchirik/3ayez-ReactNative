import React, { Component } from 'react';
import {
  Text
} from 'react-native';
import { connect } from 'react-redux';

// do this for TextInput too
class AyezText extends Component {
  render() {
    const {
      style,
      children,

      color='black',
      size=14,

      regular=false,
      medium=false,
      semibold=false,
      bold=false,
      light=false,
      extralight=false,

      forcePoppinsFont=false,
      forceCairoFont=false,

      locale
    } = this.props;

    let fontFamily = null;
    if ((locale === 'en') || forcePoppinsFont) {
      if (regular) {
        fontFamily = 'Poppins-Regular';
      } else if (medium) {
        fontFamily = 'Poppins-Medium';
      } else if (semibold) {
        fontFamily = 'Poppins-SemiBold';
      } else if (bold) {
        fontFamily = 'Poppins-Bold';
      } else if (light) {
        fontFamily = 'Poppins-Light';
      } else if (extralight) {
        fontFamily = 'Poppins-ExtraLight';
      }
    } else if ((locale === 'ar') || forceCairoFont) {
      if (regular) {
        fontFamily = "Frutiger-Regular";
      } else if (medium) {
        fontFamily = "Frutiger-Black";
      } else if (semibold) {
        fontFamily = "Frutiger-Black";
      } else if (bold) {
        fontFamily = "Frutiger-Bold";
      } else if (light) {
        fontFamily = "Frutiger-Light";
      } else if (extralight) {
        fontFamily = "Frutiger-Light";
      }
    }

    return (
      <Text
        allowFontScaling={false}
        {...this.props}
        style={{
          color,
          fontSize: size,
          ...style,
          fontFamily
        }}>{children}</Text>
    )
  }
}

const mapStateToProps = ({ Settings }) => {
  const {
    locale
  } = Settings;
  return {
    locale
  };
};

export default connect(mapStateToProps, null)(AyezText);
