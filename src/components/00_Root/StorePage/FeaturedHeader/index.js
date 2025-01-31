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
} from '../../../_common';
import {
  STATUS_BAR_HEIGHT,
  AYEZ_GREEN
} from '../../../../Helpers.js';


import {
  strings,
  translate
} from '../../../../i18n.js';

import styles from '../styles';
import colors from '../../../../theme/colors';
import { sceneKeys, navigateTo } from '../../../../router';

class FeaturedHeader extends Component {

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
    navigateTo(sceneKeys.storeShelf, {
      title: row.name,
      parent_title: strings('StoreHome.featured'),
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
              {strings('Common.seeAll')}
            </AyezText>
        </View>
      </TouchableOpacity>
    );
  }

  renderFeaturedRow({ item, index }) {
    return (
      <View style={styles.featuredRowStyle} key={index}>
        <View style={styles.sectionHeaderStyle}>
          <AyezText medium size={15} color={'#8E8E93'} style={{ marginLeft: 20 }}>
            {translate(item.name)}
          </AyezText>
          <TouchableOpacity onPress={() => this.goToShelf(item)}>
            <AyezText medium color={'#62DEAB'} style={{ marginRight: 20 }}>
              {strings('Common.viewMore')} >
            </AyezText>
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

  // renderEmptyFeatured() {
  //   return (
  //       <AyezText medium style={{ marginTop: 100, marginBottom: 100, textAlign: 'center' }}>
  //         {strings('Common.noResults')}
  //       </AyezText>
  //   )
  // }


  // go to shelf ->>
  render() {
    const {
      featured,
      featured_loading
    } = this.props;
    if (featured_loading) {
      return (
        <ActivityIndicator size="large" style={{ height: 80 }} />
      )
    }
    if (!featured.length) { return null; }

    return featured.map((item, index) => this.renderFeaturedRow({ item, index }))
    // return (
    //   <FlatList
    //     data={featured}
    //     renderItem={this.renderFeaturedRows.bind(this)}
    //     style={{ flex: 1 }}
    //     removeClippedSubviews
    //     ListFooterComponent={<View style={{ height: 28 }} />}
    //     scrollEventThrottle={10}
    //     showsVerticalScrollIndicator={false}
    //     keyExtractor={(item, index) => index.toString()}
    //   />
    // );
  }
}

const mapStateToProps = ({ Seller }) => {
  const {
    id,
    featured,
    featured_loading,
  } = Seller;
  return {
    id,
    featured,
    featured_loading
  };
};

export default connect(mapStateToProps, null)(FeaturedHeader);
