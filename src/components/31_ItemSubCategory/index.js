import React, { Component } from 'react';
import { connect } from 'react-redux';
import colors from '../../theme/colors';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import { View, FlatList, Image, TouchableOpacity } from 'react-native';
import { strings, translate, formatCurrency } from '../../i18n';
import _ from 'lodash';
import { lightenColor, darkenColor } from '../../Helpers';
import {
  AyezText,
  BackButton,
  AnimatedCheckmarkOverlay,
  BasketBlockButton,
  ItemIncrementer,
  PlaceholderFastImage
} from '../_common';
import images from '../../theme/images';
import { sceneKeys, navigateTo, navigateBack } from '../../router';

class ItemSubCategory extends Component {
  constructor(props) {
    super(props);
  }

  _renderRow = ({ item }) => {
    const { items_array } = this.props;
    const { thumbnail_url, image_url } = item;
    const url = thumbnail_url || image_url;
    const foundItem = items_array.find(w_item => w_item.upc === item.upc);
    const quantity = foundItem ? foundItem.quantity : 0;
    let mainPriceText = formatCurrency(item.price);
    if (item.incr && item.unit) {
      mainPriceText += ` / ${item.incr}${item.unit}`;
    } else if (item.incr && item.incr !== 1) {
      mainPriceText += ` / ${item.incr}`;
    }
    return (
      <TouchableOpacity
        style={styles.itemRow}
        onPress={() => {
          navigateTo(sceneKeys.itemPage, { item });
        }}
      >
        <View style={styles.itemRowContainer}>
          {this._renderProductImage(url, styles.itemRowImage)}
          <View style={styles.itemTextContainer}>
            <AyezText
              regular
              size={11}
              color={colors.darkGreyBlue}
              allowFontScaling={false}
              numberOfLines={2}
            >
              {translate(item)}
            </AyezText>
            <View style={{ flexDirection: 'row' }}>
              <AyezText
                regular
                size={12}
                color={item.cheapest ? colors.fadedRed : colors.warmGrey}
                allowFontScaling={false}
              >
                {mainPriceText}
              </AyezText>
              {item.cheapest && (
                <View style={styles.cheapestContainer}>
                  <AyezText
                    regular
                    size={10}
                    color={colors.whiteGrey}
                    allowFontScaling={false}
                  >
                    {strings('Items.cheapest')}
                  </AyezText>
                </View>
              )}
            </View>
          </View>
          <ItemIncrementer
            style={styles.ItemIncrementer}
            item={item}
            quantity={quantity}
            seller={this.props.seller}
          />
        </View>

        {this._renderSeparator()}
      </TouchableOpacity>
    );
  };

  _renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  _rednderListHeader = () => {
    const { subCategory } = this.props;
    const { thumbnail_url, image_url } = subCategory;
    const url = thumbnail_url || image_url;
    return (
      <View style={{ height: 80 }}>
        <View style={styles.itemListHeader}>
          <AyezText color={colors.darkGreyBlue} regular size={14}>
            {strings('Items.selectItem')}
          </AyezText>
          {this._renderProductImage(url, styles.itemListHeaderImage)}
        </View>
        {this._renderSeparator()}
      </View>
    );
  };

  _renderList = groupedItems => {
    const cheapestItem = _.minBy(groupedItems, 'price');
    cheapestItem.cheapest = true;
    return (
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={this._rednderListHeader}
          data={groupedItems}
          extraData={this.props.items_array}
          renderItem={this._renderRow}
          style={styles.itemList}
        />
      </View>
    );
  };

  render() {
    const { subCategory, groupedItems } = this.props;
    const { thumbnail_url, image_url, color } = subCategory;
    const url = thumbnail_url || image_url;
    return (
      <LinearGradient
        locations={[0.1, 0.8, 0.9, 1]}
        colors={[
          lightenColor(color, 80),
          color,
          darkenColor(color, 40),
          darkenColor(color, 100)
        ]}
        style={[styles.container]}
      >
        {this._renderHeader(subCategory, groupedItems)}
        {this._renderProductImage(url, styles.productImage)}
        {this._renderList(groupedItems)}
        <View style={{ height: 60 }} />
        {this._renderFooter()}
      </LinearGradient>
    );
  }

  _renderProductImage = (url, style) => {
    return (
      <View
        style={{
          marginLeft: style.marginLeft
        }}
      >
        <PlaceholderFastImage
          style={style}
          source={{
            uri: url
          }}
        />
      </View>
    );
  };

  _renderFooter = () => {
    return (
      <View style={styles.footerContainer}>
        <BasketBlockButton showBasketImage={true} />
        <AnimatedCheckmarkOverlay />
      </View>
    );
  };

  _renderHeader = (subCategory, groupedItems) => {
    return (
      <View style={styles.headerContainer}>
        <BackButton color={colors.whiteGrey} />
        <View style={styles.headerTextContainer}>
          <AyezText color={colors.whiteGrey} bold size={20}>
            {translate(subCategory.name)}
          </AyezText>
          <AyezText color={colors.whiteGrey} semiBold size={13}>
            {strings('Items.numberOfItems', {
              itemsCount: groupedItems.length,
              name: translate(subCategory.name)
            })}
          </AyezText>
        </View>
        {this._renderMagnifyingImage()}
      </View>
    );
  };

  _renderMagnifyingImage = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigateTo(sceneKeys.storeSearch);
        }}
      >
        <Image
          style={styles.magnifyingImage}
          resizeMode="contain"
          source={images.magnifying2Icon}
        />
      </TouchableOpacity>
    );
  };
}

const mapStateToProps = ({ Baskets, Seller }) => {
  const seller = Seller;
  const { items_array } = Baskets.baskets[Seller.id];
  return {
    seller,
    items_array
  };
};

export default connect(mapStateToProps)(ItemSubCategory);
