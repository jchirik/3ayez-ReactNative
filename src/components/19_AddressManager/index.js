import React, { Component } from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  FlatList,
  BackHandler
} from 'react-native';
import firebase from 'react-native-firebase';

import { Actions } from 'react-native-router-flux';
// import { Tabs } from 'antd-mobile';
import { connect } from 'react-redux';
import {
  deleteAddress
} from '../../actions';
import {
  Header,
  BlockButton,
  BottomChoiceSelection,
  AyezText
} from '../_common';

import {
  strings,
  translate
} from '../../i18n.js';

import {
  padNumberZeros,
  creditCardIcon
} from '../../Helpers.js';

const delete_icon = require('../../../assets/images_v2/Common/delete.png');

class AddressManager extends Component {

  constructor(props) {
    super(props);
    this.state = {
      addressToDelete: null
    };
  }

  renderItem({ item, index }) {
    return (
      <View
        style={{
          height: 120, backgroundColor: 'white', flexDirection: 'row',
          borderBottomWidth: 1, borderColor: '#f7f7f7',
          alignItems: 'center'
          }}
      >
        <View style={{ flex: 1, marginLeft: 26, alignItems: 'flex-start' }}>
          <AyezText medium>{item.street} {(item.area) ? translate(item.area.display_name) : null}</AyezText>
          <AyezText regular>{strings('Address.detail', {building: item.building, apt: item.apt})}</AyezText>
          <AyezText regular>{item.name}</AyezText>
        </View>

        <TouchableOpacity
          onPress={() => this.setState({ addressToDelete: item.id })}
          style={{ padding: 10, marginRight: 5 }}
          >
          <Image
           source={delete_icon}
           style={{ width: 20, height: 20 }}
           resizeMode={'contain'}
           />
        </TouchableOpacity>

      </View>
    )
  }

  closeDeleteCardConfirm() {
    this.setState({ addressToDelete: null })
  }

  render() {

    if (this.props.is_loading) {
      return (<ActivityIndicator size="small" style={{ flex: 1 }} />);
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Header
          title={strings('Settings.addressBook')}
        />
        <FlatList
          style={{ flex: 1 }}
          data={this.props.addresses}
          renderItem={this.renderItem.bind(this)}
          ListHeaderComponent={<View style={{ width: 8}} />}
          keyExtractor={(item) => item.id}
        />
        <BlockButton
          style={{ margin: 20 }}
          text={strings('AddressSelection.addNewAddress')}
          onPress={() => Actions.addressCreate()}
        />
        <BottomChoiceSelection
          isVisible={this.state.addressToDelete}
          onClose={this.closeDeleteCardConfirm.bind(this)}
          backgroundColor='#E64E47'
          title={strings('DeleteConfirmation.query')}
          buttons={[
            { text: strings('DeleteConfirmation.confirm'), action: () => this.props.deleteAddress(this.state.addressToDelete)},
            { text: strings('DeleteConfirmation.cancel'), action: () => console.log('No')}
          ]}
        />
      </View>
      );
    }
  }


  const mapStateToProps = ({ Addresses }) => {
    const { addresses, is_loading } = Addresses;
    return {
      addresses,
      is_loading
    };
  };


  export default connect(mapStateToProps,
    {
      deleteAddress
    }
  )(AddressManager);
