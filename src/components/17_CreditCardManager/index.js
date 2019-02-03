import React, { Component } from 'react';
import {
  View,
  Text,
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
  deleteCreditCard
} from '../../actions';
import {
  Header,
  BlockButton,
  BottomChoiceSelection,
  AyezText
} from '../_common';

import {
  padNumberZeros,
  paymentIcon
} from '../../Helpers.js';

import {
  strings,
  translate
} from '../../i18n.js';

const delete_icon = require('../../../assets/images_v2/Common/delete.png');


class CreditCardManager extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cardToDelete: null
    };
  }

  renderItem({ item, index }) {
    return (
      <View
        style={{
          height: 90, backgroundColor: 'white', flexDirection: 'row',
          borderBottomWidth: 1, borderColor: '#f7f7f7',
          alignItems: 'center'
          }}
      >
        <Image
          source={paymentIcon(item.brand, 'CREDIT')}
          style={{
            width: 50,
            height: 50,
            marginLeft: 24,
            marginRight: 24
          }}
          resizeMode={'contain'}
        />

        <View style={{ flex: 1 }}>
          <AyezText medium style={{
            fontSize: 14
          }}>{item.brand} (**** {item.last4})</AyezText>
          <AyezText regular style={{
            fontSize: 14,
          }}>Exp {padNumberZeros(item.exp_month, 2)}/{item.exp_year}</AyezText>
          <AyezText regular style={{
            fontSize: 14,
          }}>{item.name}</AyezText>
        </View>

        <TouchableOpacity
          onPress={() => this.setState({ cardToDelete: item.id })}
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
    this.setState({ cardToDelete: null })
  }

  render() {

    if (this.props.loading) {
      return (<ActivityIndicator size="small" style={{ flex: 1 }} />);
    }

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Header
          title={'Credit Cards'}
        />
        <FlatList
          style={{ flex: 1 }}
          data={this.props.credit_cards}
          renderItem={this.renderItem.bind(this)}
          ListHeaderComponent={<View style={{ width: 8}} />}
          keyExtractor={(item) => item.id}
        />
        <BlockButton
          style={{ margin: 20 }}
          text={'Add a Card'}
          onPress={() => Actions.creditCardCreate()}
        />

        <BottomChoiceSelection
          isVisible={this.state.cardToDelete}
          onClose={this.closeDeleteCardConfirm.bind(this)}
          backgroundColor='#E64E47'
          title='Are you sure you want to delete?'
          buttons={[
            { text: 'Yes, sure', action: () => this.props.deleteCreditCard(this.state.cardToDelete)},
            { text: 'No, cancel', action: () => console.log('No')}
          ]}
        />
      </View>
      );
    }
  }


  const mapStateToProps = ({ CreditCards }) => {
    const { credit_cards, loading } = CreditCards;
    return {
      credit_cards,
      loading
    };
  };


  export default connect(mapStateToProps,
    {
      deleteCreditCard
    }
  )(CreditCardManager);
