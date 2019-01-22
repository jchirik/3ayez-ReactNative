import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';

import {
  View,
  Modal,
  SectionList,
  Text,
  Platform,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
  Image,
  BackHandler,
  AsyncStorage
} from 'react-native';

import {
  Header
} from '../_common';

// a big comoonent
class SupportDetail extends Component {
  render() {
    const { title, description } = this.props.data;
    return (
      <View
        style={{ flex: 1, backgroundColor: 'white'}}
      >
        <Header title={title.en} />
        <Text>{description.en}</Text>
      </View>
    );
  }

}


export default connect(null, {
})(SupportDetail);
