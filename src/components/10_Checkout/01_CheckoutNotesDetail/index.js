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
  BlockButton,
  AyezText
} from '../../_common';
import {
  setOrderNotes
} from '../../../actions';

import {
  strings,
  translate,
  FONT_REGULAR
} from '../../../i18n.js';


class CheckoutNotesDetail extends Component {

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header
          title={strings('Checkout.additionalNotesHeader')}
        />
        <TextInput
          style={{
            padding: 14,
            height: 200,
            borderColor: '#EAEAEA',
            borderTopWidth: 1,
            borderBottomWidth: 1,
            fontFamily: FONT_REGULAR(),
            fontSize: 14
          }}
          onChangeText={(text) => this.props.setOrderNotes(text)}
          value={this.props.notes}
          multiline
          autoFocus
        />
        <BlockButton
          text={strings('Common.OK')}
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
