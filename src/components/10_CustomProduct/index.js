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


import { strings, FONT_MEDIUM } from '../../i18n.js';
import {
  AYEZ_BACKGROUND_COLOR,
  STATUS_BAR_HEIGHT
} from '../../Helpers.js';
import styles, { TIPlaceholderColor } from './styles';
import {
  AyezText,
  BlockButton,
  InputRow,
  CloseButton } from '../_common';
import header_image from '../../../assets/images_v2/CustomProduct/background_gradient.png';

class CustomProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input_name: '',
      input_description: '',
      input_amount: '',

      title_arab: 'name',
      title_engl: 'name',
      type: 'CUSTOM',
      incr: 1,
      quantity: 1
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onAndroidBackPress
    );
  }
  onAndroidBackPress = () => {
    Actions.pop(); // Android back press
    return true;
  };


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
              justifyContent: 'flex-end'
            }}
            source={header_image}
          >
            <AyezText semibold size={12}
              color={'white'} style={{ opacity: 0.9 }}>
              {strings('CustomProduct.header')}
            </AyezText>
            <AyezText medium size={22} color={'white'}
              style={{width: 240, marginTop: 7}}>
              {strings('CustomProduct.detail')}
            </AyezText>
          </ImageBackground>

          <View style={{ height: 5 }} />

          <InputRow
            title={strings('CustomProduct.productName')}
            value={this.state.input_name}
            onChangeText={this.onChangeText.bind(this, 'input_name')}
          />
          <InputRow
            title={strings('CustomProduct.productQuantity')}
            placeholder={strings('CustomProduct.productQuantityPlaceholder')}
            value={this.state.input_amount}
            onChangeText={this.onChangeText.bind(this, 'input_amount')}
            required={false}
          />
          <InputRow
            title={strings('CustomProduct.productDescription')}
            value={this.state.input_description}
            onChangeText={this.onChangeText.bind(this, 'input_description')}
            required={false}
            multiline={true}
          />

          <View style={{ height: 20 }} />

          <BlockButton
            style={{ marginHorizontal: 24 }}
            text={strings('CustomProduct.addToBasket')}
            onPress={() => {}}
            />
        </ScrollView>
        <CloseButton fixed />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(CustomProduct);
