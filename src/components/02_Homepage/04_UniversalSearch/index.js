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

// import {
// } from '../../../actions';
import {
  strings,
  translate
} from '../../../i18n.js';

import {
  AyezText
} from '../../_common';



class UniversalSearch extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('UniversalSearch mounted')
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <AyezText regular>Discovery</AyezText>
      </View>
    );
  }
}

// const mapStateToProps = ({ }) => {
//   return {
//   };
// };

export default connect(null, null)(UniversalSearch);
