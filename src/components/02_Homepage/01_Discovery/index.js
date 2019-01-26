import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import {
  View,
  FlatList,
  Text,
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

class Discovery extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('Discovery mounted')
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor:'white'}}>
        <Text>Discovery</Text>
      </View>
    );
  }
}

// const mapStateToProps = ({ }) => {
//   return {
//   };
// };

export default connect(null, null)(Discovery);
