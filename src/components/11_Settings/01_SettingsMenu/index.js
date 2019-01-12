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

// import {
// } from '../../../actions';


// { text: 'Credit Cards', action: null, icon: '' },
const sections = [
  {title: 'My Account', data: [
    { text: 'Address Book', action: null, icon: '' },
    { text: 'Language', action: null, icon: '' },
    { text: 'Previous Orders', action: null, icon: '' }
  ]},
  {title: 'Information', data: [
    { text: 'Terms & Conditions', action: null },
    { text: 'Privacy Policy', action: null },
  ]}
];

class SettingsMenu extends Component {

  constructor(props) {
    super(props);
  }

  renderItem({item: {text, action, icon}, index, section}) {
    return (
      <View
        key={index}
        style={{
          height: 60,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 20,
          backgroundColor: 'white',
          borderColor: '#f7f7f7',
          borderBottomWidth: 1
        }}
      >
        <Text style={{
          fontFamily: 'Poppins-Light',
          fontSize: 12,
          color: '#4E4E4E',
        }}>{text}</Text>
      </View>
    );
  }

  renderSectionHeader({section: { title }}) {
    return (
      <View style={{
        height: 60,
        paddingLeft: 20,
        paddingBottom: 10,
        backgroundColor: '#FAFCFD',
        justifyContent: 'flex-end',
        borderColor: '#f7f7f7',
        borderBottomWidth: 1
      }}>
        <Text style={{
          fontFamily: 'Poppins-Medium',
          fontSize: 12,
          color: 'black',
        }}>{title.toUpperCase()}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FAFCFD'
      }}>
        <Header title={'ACCOUNT'}/>
        <SectionList
          renderItem={this.renderItem.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          sections={sections}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    );
  }
}

// const mapStateToProps = ({ Auth }) => {
//   const {
//     phone,
//     country_code,
//     call_code,
//     phone_loading,
//     phone_error
//   } = Auth;
//   return {
//   };
// };

export default connect(null, null)(SettingsMenu);
