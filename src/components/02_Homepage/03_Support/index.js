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

import {
} from '../../../actions';


class Support extends Component {

  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log('Support mounted')
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor:'white'}}>
        <Text>Support</Text>
      </View>
    );
  }
}

const mapStateToProps = ({ }) => {
  return {
  };
};

export default connect(mapStateToProps, {
})(Support);
