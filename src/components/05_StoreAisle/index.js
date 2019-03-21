import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  View,
  FlatList,
  Platform,
  I18nManager,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  BackHandler,
  InteractionManager,
  findNodeHandle
} from 'react-native';
import styles from './styles';
import { selectSubcategory } from '../../actions';
import { strings, translate } from '../../i18n.js';
import {
  AnimatedCheckmarkOverlay,
  BackButton,
  BasketBlockButton,
  AyezText,
  PlaceholderFastImage,
  SearchBarButton
 } from '../_common';

import images from '../../theme/images'
import { sceneKeys, navigateTo } from '../../router';

class StoreAisle extends Component {
  state = {};
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        this.setState({
          bluredViewRef: findNodeHandle(this.refs['09_Corridors'])
        });
      }, 100);
    });
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      this.props.onUnmount();
    }
  }


  didSelectSubcategory(subcategory, columnIndex) {
    this.props.selectSubcategory(subcategory, columnIndex);
    navigateTo(sceneKeys.storeShelf, {
      title: subcategory.name,
      parent_title: translate(this.props.category.name),
      items: subcategory.items,
      jumpIndex: columnIndex
    });
  }

  renderTinyPhoto(subcategory, index) {
    if (index >= subcategory.items.length) return null;
    const { image_url, thumbnail_url } = subcategory.items[index];
    return (
      <TouchableOpacity
        onPress={() => {
          this.didSelectSubcategory(
            subcategory,
            (index % 2 == 0 ? index : index - 1) / 2
          );
        }}
        activeOpacity={1.0}
      >
        <PlaceholderFastImage
          style={styles.tinyPhoto}
          source={{
            uri: thumbnail_url || image_url
          }}
        />
      </TouchableOpacity>
    );
  }

  renderTinyPhotoColumn(subcategory, { item, index }) {
    const numRows = 2;
    if (index % numRows !== 0) return null;
    return (
      <TouchableOpacity style={styles.tinyPhotoColumn}>
        {this.renderTinyPhoto(subcategory, index)}
        {this.renderTinyPhoto(subcategory, index + 1)}
      </TouchableOpacity>
    );
  }

  renderSubcategoryRow({ item, index }) {
    const subcategory = item;
    const subcategoryTitle = subcategory.name
      ? translate(subcategory.name)
      : subcategory.title;

    return (
      <View style={styles.container}>
        <View style={styles.subcategoryHeader}>
          <AyezText light style={styles.subcategoryHeaderText}>{subcategoryTitle}</AyezText>
          <TouchableOpacity
            style={styles.viewCorridorContainer}
            onPress={() => this.didSelectSubcategory(subcategory, 0)}
          >
            <AyezText light style={styles.viewCorridorText}>
              {strings('Common.viewMore')} >
            </AyezText>
          </TouchableOpacity>
        </View>
        <View style={styles.subcategoryContainerShadow}>
          <FlatList
            horizontal
            disableVirtualization={I18nManager.isRTL}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
            style={styles.subcategoryContainer}
            removeClippedSubviews
            windowSize={2}
            renderItem={this.renderTinyPhotoColumn.bind(this, subcategory)}
            data={subcategory.items}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item1, index1) => index1.toString()}
          />
        </View>
      </View>
    );
  }

  renderListHeader() {
    const { categoryData } = this.props;
    return (
      <View style={styles.categoryList}>
        <FlatList
          horizontal
          windowSize={2}
          contentContainerStyle={styles.categoryListContainer}
          renderItem={this.renderCategory.bind(this)}
          data={categoryData}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item1, index1) => index1.toString()}
        />
      </View>
    );
  }

  renderCategory({ item, index }) {
    return (
      <TouchableOpacity
        onPress={() => {
          this.tableRef.scrollToIndex({
            animated: true,
            index: index
          });
        }}
        style={styles.categoryItemContainer}
      >
        <AyezText light style={styles.categoryItemText}>{translate(item.name)}</AyezText>
      </TouchableOpacity>
    );
  }

  renderNoItems() {
    if (this.props.isLoadingCategoryData) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" style={styles.activityIndicator} />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <AyezText regular style={styles.noItemAvailableText}>
            {strings('Common.noResults')}
          </AyezText>
        </View>
      );
    }
  }
  storeSearch() {
    navigateTo(sceneKeys.storeSearch);
  }
  renderSubcategoryItems(categoryData) {
    return (
      <FlatList
        ref={ref => (this.tableRef = ref)}
        style={styles.container}
        removeClippedSubviews
        initialNumToRender={3}
        alwaysBounceVertical={false}
        bounces={false}
        ListFooterComponent={<View style={styles.subcategoryItemsFooter} />}
        ListEmptyComponent={this.renderNoItems.bind(this)}
        renderItem={this.renderSubcategoryRow.bind(this)}
        data={categoryData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
  render() {
    const { categoryData, display_name: displayName } = this.props;
    return (
      <View style={styles.screenContainer} ref={'09_Corridors'}>
        <View style={styles.headerContainer}>
          <View style={styles.searchBarContainer}>
            <BackButton />
            <SearchBarButton displayName={displayName} />
            {this.renderBasketButton()}
          </View>
          {this.renderListHeader()}
        </View>
        {this.renderSubcategoryItems(categoryData)}
        <BasketBlockButton bluredViewRef={this.state.bluredViewRef} />
        <AnimatedCheckmarkOverlay />
      </View>
    );
  }

  renderBasketButton() {
    return (
      <TouchableOpacity
        style={styles.basketButton}
        onPress={() => {
          navigateTo(sceneKeys.checkoutFlow, { bluredViewRef: this.state.bluredViewRef })
        }}
      >
        <Image
          source={images.basket2Icon}
          style={styles.basketButtonImage}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => {
  const { category, categoryData, isLoadingCategoryData } = state.ItemSearch;
  const { display_name } = state.Seller;
  let categoryDataWithItems = [];
  if (categoryData) {
    categoryDataWithItems = categoryData.filter(
      subcategory => subcategory.items.length > 0
    );
  }
  return {
    display_name,
    category,
    categoryData: categoryDataWithItems,
    isLoadingCategoryData
  };
};

export default connect(
  mapStateToProps,
  {
    selectSubcategory
  }
)(StoreAisle);
