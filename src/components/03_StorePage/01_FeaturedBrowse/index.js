import React, { Component } from 'react';
import {
  View,
  Text,
   Image,
   FlatList,
   ActivityIndicator,
   TouchableOpacity,
   SectionList,
   Platform,
   BackHandler,
   AsyncStorage
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
  BlockUnderButton
} from '../../_common';
import {
} from '../../../actions';

import {
  STATUS_BAR_HEIGHT,
  AYEZ_GREEN
} from '../../../Helpers.js';


import {
  strings,
  translate
} from '../../../i18n.js';

import styles from '../styles';
import colors from '../../../theme/colors';

const endOfScrollImage = require('../../../../assets/images_v2/store_add_new_item.png');


class FeaturedBrowse extends Component {

  constructor(props) {
    super(props);
  }


  renderSeparatorView() {
    return <View style={styles.separatorViewStyle} />;
  }

  renderFeaturedItem({ item, index }) {
    const itemHeight = 220;
    const itemWidth = itemHeight * 0.7;
    return (
      <ItemTile
        item={item}
        height={itemHeight}
        width={itemWidth}
        style={{ marginVertical: 10 }}
      />
    );
  }

  goToShelf(row) {
    Actions.storeShelf({
      title: row.name,
      parent_title: { ar: 'Store Home', en: 'Store Home'},
      items: row.items,
      jumpIndex: 0
    });
  }

  renderFeaturedEnd(item) {
    return (
      <TouchableOpacity
        style={{ width: 120, flex: 1,
          justifyContent: 'center', alignItems: 'center' }}
        onPress={() => this.goToShelf(item)}>

        <View style={{ width: 100, height: 100, borderRadius: 50,
          backgroundColor: AYEZ_GREEN, justifyContent: 'center', alignItems: 'center' }}>
            <AyezText medium color={'white'} size={16}>
              {'see all'}
            </AyezText>
        </View>
      </TouchableOpacity>
    );
  }

  renderFeaturedRows({ item, index }) {
    return (
      <View style={styles.featuredRowStyle}>
        <View style={styles.sectionHeaderStyle}>
          <AyezText regular size={15} color={'#8E8E93'} style={{ marginLeft: 20 }}>
            {translate(item.name)}
          </AyezText>
          <TouchableOpacity onPress={() => this.goToShelf(item)}>
            <Text style={styles.viewCorridorTextStyle}>
              {strings('StoreHome.viewMore')} >
            </Text>
          </TouchableOpacity>
        </View>
        {this.renderSeparatorView()}
        <FlatList
          ref={ref => (this.tableRef = ref)}
          style={styles.horizontalListViewStyle}
          horizontal
          renderItem={this.renderFeaturedItem.bind(this)}
          data={item.items.slice(0, 6)}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={<View style={{ width: 16 }} />}
          ListFooterComponent={this.renderFeaturedEnd.bind(this, item)}
          keyExtractor={(item, index) => index.toString()}
          bounces={false}
        />
        {this.renderSeparatorView()}
      </View>
    );
  }


    renderEndOfScroll() {
      return (
        <View style={{ alignItems: 'center' }}>
          <Image source={endOfScrollImage} style={styles.endOfScrollImageStyle} />
          <Text style={styles.typeNewProductTextStyle}>
            {strings('StoreHome.writeYourProduct')}
          </Text>
          <Text style={styles.typeNewProductSubTextStyle}>
            {strings('StoreHome.writeYourProductSubTitle')}
          </Text>
          <TouchableOpacity
            style={[
              styles.searchBarSectionStyle,
              { marginBottom: 65, marginHorizontal: '14%', padding: 5 }
            ]}
            onPress={Actions.addProduct}
          >
          </TouchableOpacity>
        </View>
      );
    }


  renderEmptyFeatured() {

    if (this.props.featured_loading) {
      return (
        <ActivityIndicator size="small" style={{ height: 200 }} />
      )
    }

    return (
        <AyezText medium style={{ marginTop: 100, marginBottom: 100, textAlign: 'center' }}>
          {strings('StoreSubcategories.noItemsAvailable')}
        </AyezText>
    )
  }


  // go to shelf ->>
  render() {
    return (
      <FlatList
        data={this.props.featured}
        renderItem={this.renderFeaturedRows.bind(this)}
        style={{ flex: 1 }}
        removeClippedSubviews
        ListEmptyComponent={this.renderEmptyFeatured.bind(this)}
        ListFooterComponent={null}
        scrollEventThrottle={10}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
}

const mapStateToProps = ({ Seller }) => {
  const {
    id,
    featured,
    featured_loading
  } = Seller;
  return {
    id,
    featured,
    featured_loading
  };
};

export default connect(mapStateToProps, {
})(FeaturedBrowse);
