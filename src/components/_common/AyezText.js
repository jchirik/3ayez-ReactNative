import React, { Component } from 'react';
import {
  Text
} from 'react-native';
import { connect } from 'react-redux';
import fonts from '../../theme/fonts';

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
    let fontWeight = "normal";

    if ((locale === 'en') || forcePoppinsFont) {
      if (regular) {
        fontFamily = 'Poppins-Regular';
        fontWeight = "300"
      } else if (medium) {
        fontFamily = 'Poppins-Medium';
        fontWeight = "500"
      } else if (semibold) {
        fontFamily = 'Poppins-SemiBold';
        fontWeight = "700"
      } else if (bold) {
        fontFamily = 'Poppins-Bold';
        fontWeight = "bold"
      } else if (light) {
        fontFamily = 'Poppins-Light';
        fontWeight = "200"
      } else if (extralight) {
        fontFamily = 'Poppins-ExtraLight';
        fontWeight = "100"
      }
    } else if ((locale === 'ar') || forceCairoFont) {
      if (regular) {
        fontFamily = fonts.Frutiger
        fontWeight = "300"
      } else if (medium) {
        fontFamily = fonts.Frutiger;
        fontWeight = "500"
      } else if (semibold) {
        fontFamily = fonts.Frutiger;
        fontWeight = "700"
      } else if (bold) {
        fontFamily = fonts.Frutiger;
        fontWeight = "bold"
      } else if (light) {
        fontFamily = fonts.Frutiger;
        fontWeight = "200"
      } else if (extralight) {
        fontFamily = fonts.Frutiger;
        fontWeight = "100"
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
          fontFamily,
          fontWeight
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
