import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  View,
  ImageBackground,
  BackHandler,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import firebase from 'react-native-firebase';


import { strings, FONT_MEDIUM } from '../../i18n.js';
import {
  AYEZ_BACKGROUND_COLOR,
  STATUS_BAR_HEIGHT
} from '../../Helpers.js';
import styles, { TIPlaceholderColor } from './styles';

import {
  addToBasket
} from '../../actions';

import {
  AyezText,
  BlockButton,
  InputRow,
  CloseButton
} from '../_common';
import header_image from '../../../assets/images_v2/CustomProduct/background_gradient.png';

class CustomProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      custom_name: '',
      custom_description: '',
      custom_amount: ''
    };
  }


  addToBasket() {
    const { seller } = this.props;
    const {
      custom_name,
      custom_description,
      custom_amount
    } = this.state;
    const id = firebase.firestore().collection('items').doc().id;
    const item = {
      id,
      upc: id,
      is_custom: true,
      custom_name,
      custom_description,
      custom_amount,
      title_arab: custom_name,
      title_engl: custom_name,
      instructions: custom_description,
      incr: 1,
      price: 0,
      quantity: 1
    }
    this.props.addToBasket(item, seller.id);
    Actions.popTo('storePage');
  }

  onChangeText(key, value) {
    const update = {};
    update[key] = value;
    this.setState(update);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: AYEZ_BACKGROUND_COLOR}}>
        <ScrollView style={{ flex: 1 }}>
          <ImageBackground
            style={{
              height: 180 + STATUS_BAR_HEIGHT,
              paddingLeft: 30,
              paddingBottom: 30,
              alignItems: 'flex-start',
              justifyContent: 'flex-end'
            }}
            source={header_image}
          >
            <AyezText semibold size={12}
              color={'white'} style={{ opacity: 0.9 }}>
              {strings('CustomProduct.header')}
            </AyezText>
            <AyezText medium size={22} color={'white'}
              style={{width: 240, marginTop: 7, textAlign: 'left'}}>
              {strings('CustomProduct.detail')}
            </AyezText>
          </ImageBackground>

          <View style={{ height: 5 }} />

          <InputRow
            title={strings('CustomProduct.productName')}
            value={this.state.custom_name}
            onChangeText={this.onChangeText.bind(this, 'custom_name')}
          />
          <InputRow
            title={strings('CustomProduct.productQuantity')}
            placeholder={strings('CustomProduct.productQuantityPlaceholder')}
            value={this.state.custom_amount}
            onChangeText={this.onChangeText.bind(this, 'custom_amount')}
            required={false}
          />
          <InputRow
            title={strings('CustomProduct.productDescription')}
            value={this.state.custom_description}
            onChangeText={this.onChangeText.bind(this, 'custom_description')}
            required={false}
            multiline={true}
          />

          <View style={{ height: 20 }} />

          <BlockButton
            style={{ marginHorizontal: 24 }}
            text={strings('CustomProduct.addToBasket')}
            onPress={this.addToBasket.bind(this)}
            />
        </ScrollView>
        <CloseButton fixed />
      </View>
    );
  }
}

const mapStateToProps = ({ Seller }) => {
  const seller = Seller;
  return {
    seller
  };
};

export default connect(mapStateToProps, {
  addToBasket
})(CustomProduct);
