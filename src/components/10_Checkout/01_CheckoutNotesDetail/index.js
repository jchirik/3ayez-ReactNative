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
  Header,
  BlockButton
} from '../../_common';
import {
  setOrderNotes
} from '../../../actions';


class CheckoutNotesDetail extends Component {

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header
          title={'Additional Notes'}
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
          onChangeText={(text) => this.props.setOrderNotes(text)}
          value={this.props.notes}
          multiline
          autoFocus
        />
        <BlockButton
          text={'OK'}
          style={{ marginLeft: 20, marginRight: 20, marginTop: 10 }}
          onPress={() => Actions.pop()}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ Checkout }) => {
  const {
    notes
  } = Checkout;
  return {
    notes
  };
};

export default connect(mapStateToProps, {
  setOrderNotes
})(CheckoutNotesDetail);
