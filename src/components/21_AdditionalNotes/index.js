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
   AsyncStorage
 } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  Header,
  BlockButton
} from '../_common';

import {
  strings,
  translate
} from '../../i18n.js';


class AdditionalNotes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
  }

  componentDidMount() {
    this.setState({ text: this.props.initText })
  }

  onSubmitPress() {
    this.props.onSubmit(this.state.text);
    Actions.pop();
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header
          title={this.props.title}
          onBackPress={this.onSubmitPress.bind(this)}
        />
        <TextInput
          style={{
            padding: 14,
            height: 200,
            borderColor: '#EAEAEA',
            borderTopWidth: 1,
            borderBottomWidth: 1,
            fontFamily: 'Poppins-Regular',
            fontSize: 14
          }}
          onChangeText={(text) => this.setState({ text })}
          value={this.state.text}
          multiline
          autoFocus
        />
        <BlockButton
          text={'OK'}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}
          onPress={this.onSubmitPress.bind(this)}
        />
      </View>
    );
  }
}

export default AdditionalNotes;
