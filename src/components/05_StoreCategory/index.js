import _ from 'lodash';
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  View,
  Modal,
  FlatList,
  Text,
  Platform,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
  Image,
  BackHandler
} from 'react-native';

import {
  selectSubcategory
} from '../../actions';
import { strings, statusBarMargin, fetchCategoryImage, localizeDN } from '../../Helpers.js';
import {
  BackButton
} from '../_common';

const loadingCircleGray = null // require('../../../assets/images/loading_circle_gray.png');

import firebase from 'react-native-firebase';
// const ITEM_HEIGHT = (Dimensions.get('window').width/3) + 42;

// const ImgCacheLib = require('react-native-img-cache');
// const CachedImage = ImgCacheLib.CachedImage;

// let CachedImage = Image;
// if (Platform.OS === 'android') {
//     const ImgCacheLib = require('react-native-img-cache');
//     CachedImage = ImgCacheLib.CachedImage;
// }


const window = Dimensions.get('window');

class StoreCategory extends Component {

  constructor(props) {
    super(props);
    // this.state = { }; // for saving image_url statuses
    // format: imageURL: true/false (true = isLoading, false = done/not Loading)
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);

    // firebase.crashlytics().crash()
    // firebase.analytics().logEvent(
    //   'entered_category',
    //   {
    //     name: this.props.category.name.en,
    //     full_text: 'testing analytics'
    //   }
    // )
  }

  componentWillUnmount() {
    if (this.props.onUnmount) { this.props.onUnmount(); }
    BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  onAndroidBackPress = () => {
    Actions.popTo('storeCategories'); // Android back press
    return true;
  }


  didSelectSubcategory(subcategory, columnIndex) {
    this.props.selectSubcategory(subcategory, columnIndex);
    Actions.storeShelf({ items: subcategory.items });
  }

  renderTinyPhoto({ image_url, thumbnail_url }) {
    return (
        <View style={{
          width: 85,
          height: 85
        }}
        >
          <Image
            style={{
              width: 85,
              height: 85
            }}
            defaultSource={loadingCircleGray}
            resizeMode={'contain'}
            // use thumbnail if image not avail
            source={{ uri: thumbnail_url || image_url }}
          />
        </View>
    )
  }

  renderTinyPhotoColumn(subcategory, { item, index }) {

    // provide the SEARCH RESULTS
    const numRows = 2;
    if (index % numRows !== 0) return null;

    // if at the last item
    if (index === subcategory.items.length-1) {
      return (
        <TouchableOpacity
          style={{height: 170, width: 85 }}
          onPress={() => this.didSelectSubcategory(subcategory, columnIndex)}
          activeOpacity={1.0}
          >
          {this.renderTinyPhoto(subcategory.items[index])}
        </TouchableOpacity>
      );
    }

    // columnIndex necessary for knowing which column to jump to in the next page
    const columnIndex = Math.floor(index / 2);
    return (
      <TouchableOpacity
        style={{height: 170, width: 85 }}
        onPress={() => this.didSelectSubcategory(subcategory, columnIndex)}
        activeOpacity={1.0}
        >
        {this.renderTinyPhoto(subcategory.items[index])}
        {this.renderTinyPhoto(subcategory.items[index+1])}
      </TouchableOpacity>
    );

  }

  renderSubcategoryRow({ item, index }) {

    const subcategory = item;
    const subcategoryTitle = subcategory.name ? localizeDN(subcategory.name) : subcategory.title;

    return (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "flex-start",
          height: 240
        }}
      >
        <Text style={styles.subcategoryHeader}>{subcategoryTitle}</Text>
        <FlatList
          horizontal
          removeClippedSubviews
          initialNumToRender={5}
          windowSize={2}
          renderItem={this.renderTinyPhotoColumn.bind(this, subcategory)}
          data={subcategory.items}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item1, index1) => index1}
        />
      </View>
    );
  }

  renderListHeader() {
    const { category } = this.props;
    return (
      <View style={{ height: 20, marginTop: 30 }}>
        <Text>{this.props.category.filter}</Text>
      </View>
    );
  }

  renderNoItems() {
    // change this to loading
    if (this.props.isLoadingCategoryData) {
      return (
        <View style={{ flex: 1 }}>
          <ActivityIndicator size="large" style={{ height: 40, flex: 1, marginTop: 100 }} />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Text style={{
            marginTop: 20,
            fontSize: 18,
            textAlign: 'center'
          }}>{strings('StoreSubcategories.noItemsAvailable')}</Text>
        </View>
      )
    }
  }

  render() {

    const {
      category,
      categoryData
    } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <BackButton type='cross_circled' />
        <FlatList
        style={{ flex: 1 }}
        removeClippedSubviews
        initialNumToRender={3}
        alwaysBounceVertical={false}
        bounces={false}
        ListHeaderComponent={this.renderListHeader.bind(this)}
        ListFooterComponent={(<View style={{ height: 60 }} />)}
        ListEmptyComponent={this.renderNoItems.bind(this)}
        renderItem={this.renderSubcategoryRow.bind(this)}
        data={categoryData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
      />
      </View>
    );
  }

}


const styles = {
  subcategoryHeader: {
    textAlign: 'left',
    color: 'black',
    margin: 16,
    fontSize: 20
  }
};

const mapStateToProps = ({ ItemSearch }) => {
  const { category, categoryData, isLoadingCategoryData } = ItemSearch;

  let categoryDataWithItems = [];
  if (categoryData) {
    categoryDataWithItems = categoryData.filter(subcategory => subcategory.items.length > 0);
  }
  return {
    category,
    categoryData: categoryDataWithItems,
    isLoadingCategoryData
  };
};

export default connect(mapStateToProps, {
  selectSubcategory
})(StoreCategory);
