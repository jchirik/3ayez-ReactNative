import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
   Image,
   ActivityIndicator,
   TouchableOpacity,
   SectionList,
   Platform,
   BackHandler,
   AsyncStorage
 } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  Header
} from '../../_common';

import {
} from '../../../actions';

class SettingsMenu extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header title={'SETTINGS'}/>


      </View>
    );
  }
}

const mapStateToProps = ({ Auth }) => {
  const {
    phone,
    country_code,
    call_code,
    phone_loading,
    phone_error
  } = Auth;
  return {
  };
};

export default connect(mapStateToProps, {
})(SettingsMenu);
