import React, { Component } from 'react';
import {
  View,
  TextInput,
   Image,
   ActivityIndicator,
   TouchableOpacity,
   SectionList,
   Platform,
   BackHandler,
   AsyncStorage,
   I18nManager
 } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  Header,
  BlockButton
} from '../_common';

import {
  strings,
  translate,
  FONT_REGULAR
} from '../../i18n.js';


class ReferralPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header
          title={'Referral Page'}
        />
      </View>
    );
  }
}


const mapStateToProps = ({ Coupon }) => {
  const {
    coupon,
    is_loading,
    error
  } = Coupon;
  return {
    coupon,
    is_loading,
    error
  };
};

export default connect(mapStateToProps, {
})(ReferralPage);
