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
        fontFamily = 'Cairo-Regular';
      } else if (medium) {
        fontFamily = 'Cairo-SemiBold';
      } else if (semibold) {
        fontFamily = 'Cairo-Bold';
      } else if (bold) {
        fontFamily = 'Cairo-Black';
      } else if (light) {
        fontFamily = 'Cairo-Light';
      } else if (extralight) {
        fontFamily = 'Cairo-ExtraLight';
      }
    }

    return (
      <Text style={{
        color: 'black',
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
