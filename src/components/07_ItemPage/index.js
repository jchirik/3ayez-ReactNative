import React, { Component } from 'react';
import { connect } from 'react-redux';
import { format } from '../../utils/string';
import {
  View,
  ScrollView,
  Text,
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
  Row
} from '../_common';

import { ItemIncrementer } from '../_reusable';

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

const loadingCircleGreen = require('../../../assets/images/loading_circle_green.png');
const shareIcon = require('../../../assets/images_v2/share_icon.png');

import { addToBasket, saveItemSpecialRequests } from '../../actions';
import { strings, translate } from '../../i18n.js';
import { Actions } from 'react-native-router-flux';
import images from '../../theme/images';

const SHOW_DELAY_DELIVERY_MODAL_QUANTITY = 6;
const PRODUCE_CATEGORY = 'produce';

class ItemPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ripeness: 0,
      requires_call: false,
      instructions: '',

      showedMoreThanSixItemsModal: false
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
    Actions.pop()
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

  _showDeliveryDelayModal() {
    return (
      <Modal
        callback={() => this.setState({ showedMoreThanSixItemsModal: true })}
        image={images.flyingPersonImg}
        text={strings('ItemView.moreThanSixProducts')}
        confirmation={strings('ItemView.moreThanSixProductsConfirmation')}
      />
    );
  }

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

//<Image source={shareIcon} style={styles.shareIconStyle} />
  render() {
    const { item, seller, items_array } = this.props;

    const { image_url, price, promotion_price } = item;
    const foundItem = items_array.find(w_item => w_item.upc === item.upc);
    const quantity = foundItem ? foundItem.quantity : 0;
    return (
      <View style={styles.container}>
        {!this.state.showedMoreThanSixItemsModal &&
          items_array.reduce((total, item) => {
            return total + (item.quantity ? item.quantity : 0);
          }, 0) === SHOW_DELAY_DELIVERY_MODAL_QUANTITY &&
          this._showDeliveryDelayModal()}




        <ScrollView style={{ flex: 1, paddingTop: 48, paddingLeft: 24, paddingRight: 24 }}>
            <TouchableOpacity
              onPress={() => Actions.itemImageView({ imageUrl: image_url })}
              style={{ alignSelf: 'center' }}
            >
              <Image
                style={styles.itemImageStyle}
                resizeMode={'contain'}
                defaultSource={loadingCircleGreen}
                source={{ uri: image_url }}
              />
            </TouchableOpacity>
          <PromotionBadge price={price} promotion_price={promotion_price} />

          <View style={{ height: 4 }} />

          <AyezText semibold size={18} >{translate(item)}</AyezText>

          <View style={{ height: 22 }} />

          {this._isProduce(item) ? (
            <View>
              <AyezText medium>{strings('ItemView.selectProductRipe')}</AyezText>
              <RipenessSlider
                onValueChange={(value) => this.setState({ ripeness: value })}
                value={this.state.ripeness}
                />
              <View style={{ height: 18 }} />
            </View>
          ) : null }



          <Row
            style={{ paddingLeft: 0, paddingRight: 0 }}
            onPress={() => Actions.additionalNotes({
              title: 'Item instructions',
              initText: this.state.instructions,
              onSubmit: (text) => this.setState({ instructions: text })
            })}
            title={'Additional Instructions :'}>
            {this.state.instructions ? (
              <AyezText regular style={{
                fontSize: 15,
              }}>{ this.state.instructions }</AyezText>
            ) : (
              <AyezText regular style={{
                fontSize: 15,
                color: '#cecece'
              }}>Add notes</AyezText>
            )}
          </Row>

          <View style={{ height: 10 }} />

          <Row
            disabled
            style={{ paddingLeft: 0, paddingRight: 0 }}
            title={'Call me when selecting this product :'}>
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
        </ScrollView>


        <View style={{
          height: 70,
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
              width: 160,
              height: 48,
              marginRight: 24
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
