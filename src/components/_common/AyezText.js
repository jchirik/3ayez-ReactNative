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
        fontFamily = 'FrutigerLTArabic-55Roman';
      } else if (medium) {
        fontFamily = 'FrutigerLTArabic-55Roman';
      } else if (semibold) {
        fontFamily = 'FrutigerLTArabic-65Bold';
      } else if (bold) {
        fontFamily = 'FrutigerLTArabic-75Black';
      } else if (light) {
        fontFamily = 'FrutigerLTArabic-45Light';
      } else if (extralight) {
        fontFamily = 'FrutigerLTArabic-45Light';
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
