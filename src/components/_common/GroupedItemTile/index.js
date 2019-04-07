import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image, Text, Platform } from 'react-native';
import { translate, strings, formatCurrency } from '../../../i18n';
import colors from '../../../theme/colors';
import { AyezText, PlaceholderFastImage } from '../.';
import _ from 'lodash';
import { sceneKeys, navigateTo } from '../../../router';
import styles from './styles';

class GroupedItemTile extends PureComponent {
  constructor(props) {
    super(props);
  }

  _minPrice(items) {
    return formatCurrency(_.minBy(items, 'price').price);
  }
  _maxPrice(items) {
    return formatCurrency(_.maxBy(items, 'price').price);
  }

  _renderItemText(groupedItems, subCategory) {
    return (
      <View style={styles.textContainer}>
        <AyezText
          bold
          numberOfLines={1}
          style={{ marginVertical: 10 }}
          allowFontScaling={false}
        >
          {translate(subCategory.name)}
        </AyezText>
        <AyezText
          regular
          size={10}
          color={colors.ayezSubGreen}
          style={styles.descriptionText}
          allowFontScaling={false}
        >
          {strings('Items.priceRange', {
            itemsCount: groupedItems.length,
            minPrice: this._minPrice(groupedItems),
            maxPrice: this._maxPrice(groupedItems)
          })}
        </AyezText>
      </View>
    );
  }

  _renderImage(url) {
    const mainComponent = (
      <View style={{ alignSelf: 'stretch' }}>
        <PlaceholderFastImage
          style={{
            width: '100%',
            height: '98%'
          }}
          source={{ uri: url }}
        />
      </View>
    );
    //
    return (
      <View style={styles.itemImageContainer}>
        <View style={{ ...styles.itemImageContainer, height: '100%' }}>
          {mainComponent}
        </View>
      </View>
    );
  }
  render() {
    const { subCategory, width, height, style, groups } = this.props;
    const groupedItems = groups[subCategory.filter];
    const { thumbnail_url, image_url } = subCategory;
    const url = thumbnail_url || image_url;
    return (
      <View style={[styles.itemCellContainer, { width, height }, style]}>
        <TouchableOpacity
          onPress={() => {
            navigateTo(sceneKeys.ItemSubCategory, {
              groupedItems,
              subCategory
            });
          }}
          style={styles.constainer}
        >
          {this._renderImage(url)}
          {this._renderItemText(groupedItems, subCategory)}
        </TouchableOpacity>
      </View>
    );
  }
}

export default GroupedItemTile;
