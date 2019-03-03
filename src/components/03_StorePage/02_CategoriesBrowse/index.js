import React, { Component } from 'react';
import {
  View,
   Image,
   FlatList,
   ActivityIndicator,
   TouchableOpacity,
   SectionList,
   Platform,
   BackHandler,
   AsyncStorage,
   Dimensions
 } from 'react-native';

 import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  BackButton,
  AyezText,
  ItemTile,
  BlockButton,
  BasketBlockButton,
  AnimatedCheckmarkOverlay,
  BlockUnderButton,
  CustomItemPrompt
} from '../../_common';
import {
  STATUS_BAR_HEIGHT,
  AYEZ_GREEN
} from '../../../Helpers.js';


import FastImage from 'react-native-fast-image';

const window = Dimensions.get('window');
import { onSelectCategory } from '../../../actions';



import {
  strings,
  translate
} from '../../../i18n.js';

import styles from '../styles';
import colors from '../../../theme/colors';
import { sceneKeys, navigateTo } from '../../../router';

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


    // Categories tab
    renderItem({ item, index }) {
      return (
        <TouchableOpacity
          style={{
            marginBottom: 2,
            justifyContent: 'center',
            alignItems: 'center',
            width: window.width/2,
            height: 140,
            paddingLeft: index % 2 == 0 ? '5.3%' : '1.4%',
            paddingRight: index % 2 == 0 ? '1.4%' : '5.3%'
          }}
          onPress={this.onSelectCategory.bind(this, item)}
        >
          <View style={styles.categoryCard}>
            <FastImage
              source={{ uri: item.image_url }}
              style={styles.categoryImage}
              resizeMode={'cover'}
            />
          </View>

          <AyezText size={12}
            regular style={{ marginTop: 6 }}>{translate(item.name)}</AyezText>
        </TouchableOpacity>
      );
    }

    renderFooter() {
      if (this.props.categories_loading) { return null }
      return (
        <View style={{ marginBottom: 15, marginHorizontal: 8 }}>
          <CustomItemPrompt />
        </View>
      )
    }

    renderEmptyCategories() {
      if (this.props.categories_loading) {
        return (
          <ActivityIndicator size="small" style={{ margin: 30, alignSelf: 'center' }} />
        )
      }
      return null;
    }

  render() {
    console.log('CATEGORIES', this.props.categories);
    return (
      <FlatList
        data={this.props.categories}
        renderItem={this.renderItem.bind(this)}
        style={styles.categoryList}
        removeClippedSubviews
        ListHeaderComponent={null}
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
  const {
    id,
    categories,
    categories_loading
  } = Seller;
  return {
    seller_id: id,
    categories,
    categories_loading
  };
};

export default connect(mapStateToProps, {
  onSelectCategory
})(CategoriesBrowse);
