import React, { Component } from 'react';
import { connect } from 'react-redux';
import { format } from '../../utils/string';
import {
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Switch
} from 'react-native';
import {
  BackButton,
  AyezText,
  Row,
  ItemIncrementer
} from '../_common';


import { isIPhoneX } from '../../Helpers.js';

import {
  Divider,
  RipenessSlider,
  PriceLabel,
  PromotionBadge,
  RelatedProduct,
  Modal
} from './_components';
import styles, {
  additionalInstructionsTextInputPlaceholderColor
} from './styles';

import { addToBasket, saveItemSpecialRequests } from '../../actions';
import { strings, translate } from '../../i18n.js';
import { Actions } from 'react-native-router-flux';
import images from '../../theme/images';
import { sceneKeys, navigateTo, navigateBack } from '../../router';

const SHOW_DELAY_DELIVERY_MODAL_QUANTITY = 6;
const PRODUCE_CATEGORY = 'produce';

class ItemPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ripeness: 0,
      requires_call: false,
      instructions: ''
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    const { items_array, item } = this.props;

    const foundItem = items_array.find(w_item => w_item.upc === item.upc);

    if (foundItem) {
      this.setState({
        ripeness: foundItem.ripeness || 0,
        requires_call: foundItem.requires_call || false,
        instructions: foundItem.instructions || ''
      })
    }
  }

  onBackPress() {
    // save the ripeness, requires_call, and instructions with the item in basket
    const { ripeness, requires_call, instructions } = this.state;
    const { item, seller } = this.props;
    this.props.saveItemSpecialRequests(item.upc, seller.id, {
      ripeness, requires_call, instructions
    });
    navigateBack();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onAndroidBackPress
    );
  }

  onAndroidBackPress = () => {
    this.onBackPress();
    return true;
  };

  _addToBasket = () => {
    this.props.addToBasket(this.props.item, this.props.seller.id);
  };

  // _showDeliveryDelayModal() {
  //   return (
  //     <Modal
  //       callback={() => this.setState({ showedMoreThanSixItemsModal: true })}
  //       image={images.flyingPersonImg}
  //       text={strings('ItemView.moreThanSixProducts')}
  //       confirmation={strings('ItemView.moreThanSixProductsConfirmation')}
  //     />
  //   );
  // }

  _isProduce(item) {
    if (
      item &&
      item.categories &&
      item.categories.lvl0 &&
      item.categories.lvl0.length > 0 &&
      item.categories.lvl0[0] === PRODUCE_CATEGORY
    ) {
      return true;
    }
    return false;
  }

//<Image source={images.shareIcon} style={styles.shareIconStyle} />
  render() {
    const { item, seller, items_array } = this.props;

    console.log(item)

    const { image_url, price, promotion_price } = item;
    const foundItem = items_array.find(w_item => w_item.upc === item.upc);
    const quantity = foundItem ? foundItem.quantity : 0;


      // {!this.state.showedMoreThanSixItemsModal &&
      //   items_array.reduce((total, item) => {
      //     return total + (item.quantity ? item.quantity : 0);
      //   }, 0) === SHOW_DELAY_DELIVERY_MODAL_QUANTITY &&
      //   this._showDeliveryDelayModal()}
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1, paddingTop: 48, marginLeft: 24, marginRight: 24 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
            <TouchableOpacity
              onPress={() => {
                navigateTo(sceneKeys.itemImageView, { imageUrl: image_url })
              }}
              style={{ alignSelf: 'center' }}
            >
              <Image
                style={styles.itemImageStyle}
                resizeMode={'contain'}
                defaultSource={images.loadingCircleGreen}
                source={{ uri: image_url }}
              />
            </TouchableOpacity>
          <PromotionBadge price={price} promotion_price={promotion_price} />

          <View style={{ height: 4 }} />

          <AyezText semibold size={18}
            style={{ alignSelf: 'flex-start', textAlign: 'left' }}
          >{translate(item)}</AyezText>

          {translate(item.description) ? (
            <AyezText
              regular
              size={14}
              color={'#333333'}
              style={{ marginTop: 10, alignSelf: 'flex-start', textAlign: 'left' }}
              >{translate(item.description).replace(new RegExp('<br>', 'g'), '\n')}</AyezText>
          ) : null}

          <View style={{ height: 22 }} />

          {this._isProduce(item) ? (
            <View>
              <AyezText medium>{strings('ItemView.selectProduceRipeness')}</AyezText>
              <RipenessSlider
                onValueChange={(value) => this.setState({ ripeness: value })}
                value={this.state.ripeness}
                />
              <View style={{ height: 18 }} />
            </View>
          ) : null }

          <Row
            style={{ paddingLeft: 0, paddingRight: 0 }}
            onPress={() => {
                navigateTo(sceneKeys.additionalNotes, {
                title: strings('ItemView.additionalInstructionsHeader'),
                initText: this.state.instructions,
                onSubmit: (text) => this.setState({ instructions: text })
                })
            }}
            title={strings('ItemView.additionalInstructionsField')}>
            {this.state.instructions ? (
              <AyezText regular style={{
                fontSize: 15,
              }}>{ this.state.instructions }</AyezText>
            ) : (
              <AyezText regular style={{
                fontSize: 15,
                color: '#cecece'
              }}>{strings('ItemView.instructionsPlaceholder')}</AyezText>
            )}
          </Row>

          <Row
            disabled
            style={{ paddingLeft: 0, paddingRight: 0 }}
            title={strings('ItemView.callMe')}>
            <Switch
              style={{ marginBottom: 5 }}
              value={this.state.requires_call}
              onValueChange={(val) => this.setState({ requires_call: val })}
              />
          </Row>


          {/*
          <View>
            <Text style={styles.relatedProductsText}>
              {strings('ItemView.relatedProducts')}
            </Text>
            {this.props.subcategory && (
              <FlatList
                horizontal={true}
                style={styles.relatedProducts}
                data={this.props.subcategory.items}
                renderItem={item => (
                  <RelatedProduct
                    image_url={item.item.image_url}
                    price={item.item.price}
                    name={translate(item.item)}
                    onPress={() => {
                      Actions.itemPage({ item: item.item });
                    }}
                  />
                )}
                keyExtractor={(_, index) => index.toString()}
              />
            )}
          </View> */}
          <View style={{ height: 90 }} />
        </ScrollView>


        <View style={{
          height: 70,
          marginBottom: isIPhoneX() ? 20 : 0,
          backgroundColor: 'white',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopWidth: 1,
          borderColor: '#f7f7f7'
        }}>
          <ItemIncrementer
            fullscreen
            item={item}
            quantity={quantity}
            seller={seller}
            style={{
              width: '45%',
              height: 48,
              marginRight: 22
            }}
          />
          <PriceLabel
            price={price}
            promotion_price={promotion_price}
            item={item}
          />
        </View>
        <BackButton fixed onPress={() => this.onBackPress()}/>
      </View>
    );
  }
}

const mapStateToProps = ({ Baskets, Seller, ItemSearch }) => {
  const seller = Seller;
  const { items_array } = Baskets.baskets[Seller.id];
  const { subcategory } = ItemSearch;
  return {
    seller,
    items_array,
    subcategory,
    addToBasket
  };
};

export default connect(
  mapStateToProps,
  { saveItemSpecialRequests }
)(ItemPage);
