import React, { Component } from 'react';
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { AyezText, CustomItemPrompt, ClickableShadow } from '../../../_common';
import { onSelectCategory } from '../../../../actions';
import { translate } from '../../../../i18n.js';
import { sceneKeys, navigateTo } from '../../../../router';
import styles from '../styles';
import FeaturedHeader from '../FeaturedHeader';

const window = Dimensions.get('window');
const CATEGORY_COL_NUM = 2;
const CATEGORY_SCROLL_EVENT_THROTTLE = 16;

class CategoriesBrowse extends Component {
  constructor(props) {
    super(props);
  }

  onSelectCategory(category) {
    this.props.onSelectCategory(this.props.seller_id, category);
    navigateTo(sceneKeys.storeAisle);
  }

  renderCategoryItem({ item, index }) {
    const width = window.width / 2 - 25;
    const height = window.width / 2 - 25;
    const marginLeft = index % 2 == 0 ? 20 : 5;
    const marginRight = index % 2 == 0 ? 5 : 20;
    return (
      <ClickableShadow
        width={width}
        height={height}
        style={{ ...styles.categoryCardContainer, marginLeft, marginRight }}
        onPress={this.onSelectCategory.bind(this, item)}
      >
        <View style={styles.categoryCard}>
          <Image
            source={{ uri: item.image_url || '' }}
            style={styles.categoryImage}
            resizeMode={'cover'}
          />
          <AyezText
            medium
            size={16}
            style={{ ...styles.categoryText, width: window.width / 2 - 45 }}
          >
            {translate(item.name)}
          </AyezText>
        </View>
      </ClickableShadow>
    );
  }

  renderFooter() {
    if (this.props.categories_loading) {
      return null;
    }
    return (
      <View style={{ marginBottom: 15, marginHorizontal: 8 }}>
        <CustomItemPrompt />
      </View>
    );
  }

  renderEmptyCategories() {
    if (this.props.categories_loading) {
      return (
        <ActivityIndicator
          size="small"
          style={{ margin: 30, alignSelf: 'center' }}
        />
      );
    }
    return null;
  }

  render() {
    const { categories } = this.props;
    console.log('CATEGORIES', categories);
    return (
      <FlatList
        data={categories}
        renderItem={this.renderCategoryItem.bind(this)}
        style={styles.categoryList}
        removeClippedSubviews
        ListHeaderComponent={
          <View>
            <FeaturedHeader />
            <View style={{ height: 10 }} />
          </View>
        }
        numColumns={CATEGORY_COL_NUM}
        ListEmptyComponent={this.renderEmptyCategories.bind(this)}
        ListFooterComponent={this.renderFooter.bind(this)}
        scrollEventThrottle={CATEGORY_SCROLL_EVENT_THROTTLE}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}

const mapStateToProps = ({ Seller }) => {
  const { id, categories, categories_loading } = Seller;
  return {
    seller_id: id,
    categories,
    categories_loading
  };
};

export default connect(
  mapStateToProps,
  {
    onSelectCategory
  }
)(CategoriesBrowse);
