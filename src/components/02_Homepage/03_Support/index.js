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
  STATUS_BAR_HEIGHT
} from '../../../Helpers.js';

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

        <Text style={{
          marginTop: STATUS_BAR_HEIGHT,
          marginLeft: 4,
          fontFamily: 'Poppins-Bold',
          fontSize: 32,
          padding: 16,
        }}>Support</Text>


        <TouchableOpacity
          onPress={() => Actions.settings()}
        >
          <Text>Settings</Text>
        </TouchableOpacity>
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
