import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import {
  View,
  FlatList,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  BackHandler
} from 'react-native';

import {
  AyezText
} from '../../_common';

import {
  strings,
  translate
} from '../../../i18n.js';

class Discovery extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('Discovery mounted')
  }

  render() {
    return (
      <AyezText regular style={{ flex: 1 }}>
        <Text>Discovery</Text>
      </AyezText>
    );
  }
}

// const mapStateToProps = ({ }) => {
//   return {
//   };
// };

export default connect(null, null)(Discovery);
